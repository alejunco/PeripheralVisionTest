(function () {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .controller('PeripheralTestController', PeripheralTestController);

  PeripheralTestController.$inject = ['$log', '$timeout', '$interval', '$window', '$document', '$state', '$element', '$scope', 'TestConfigService'];

  function PeripheralTestController($log, $timeout, $interval, $window, $document, $state, $element, $scope, TestConfigService) {
    var vm = this;
    vm.title = 'Peripheral Test Controller';
    vm.isFullscreen = false;
    // vm.padding = 10;
    // vm.centerItemSize = 60;
    // vm.squareSize = 20;
    // vm.squareBackgroundColor = 'white';
    // vm.squareBorderColor = 'black';
    // vm.miDelay = 1500;
    // vm.maxDelay = 2000;
    vm.testIsActive = false;
    vm.showNavbar = false;
    vm.results = [];

    vm.testState = 'new'; //'new', 'in-progress', 'finished'

    vm.startNewTest = startNewTest;
    vm.endTest = endTest;
    vm.resetTest = resetTest;

    var canvas;
    var context;
    var intervalHandler;
    var nextSquareTimerHandler;
    var count;

    activate();

    ////////////////

    function activate() {
      loadConfig();
      initialCanvasSetup();
    }

    function loadConfig() {
      TestConfigService.load();
      vm.padding = TestConfigService.padding;
      vm.centerItemSize = TestConfigService.centerItemSize;
      vm.squareSize = TestConfigService.squareSize;
      vm.squareBackgroundColor = TestConfigService.squareBackgroundColor;
      vm.squareBorderColor = TestConfigService.squareBorderColor;
      vm.miDelay = TestConfigService.miDelay;
      vm.maxDelay = TestConfigService.maxDelay;
    }

    function startNewTest() {
      if (vm.testState === 'new') {
        vm.showNavbar = false;
        requestFullscreen();
        startTestCountdown();
      }
    }

    function endTest() {
      if (vm.testState === 'in-progress') {
        vm.testState = 'finished';
        $interval.cancel(intervalHandler);
        $timeout.cancel(nextSquareTimerHandler);
        vm.countdownMessage = '';
        clearCanvas();
        exitFullscreen();
      }
    }

    function resetTest() {
      if (vm.testState === 'finished') {
        vm.testState = 'new';
      }
    }

    function requestFullscreen() {
      var target = angular.element('body')[0];

      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen();
      } else if (target.webkitRequestFullScreen) {
        target.webkitRequestFullScreen();
      } else if (target.msRequestFullscreen) {
        target.msRequestFullscreen();
      }
    }

    function exitFullscreen() {
      var target = $document[0];

      if (target.exitFullscreen) {
        target.exitFullscreen();
      } else if (target.webkitExitFullscreen) {
        target.webkitExitFullscreen();
      } else if (target.mozCancelFullScreen) {
        target.mozCancelFullScreen();
      } else if (target.msExitFullscreen) {
        target.msExitFullscreen();
      }
    }

    function initialCanvasSetup() {
      canvas = angular.element('#canvas1')[0];
      context = canvas.getContext('2d');
      canvas.height = $window.innerHeight;
      canvas.width = $window.innerWidth;
    }

    function startTestCountdown() {
      vm.testState = 'in-progress';
      count = 4;
      intervalHandler = $interval(function () {
        $log.debug(count);
        if (count === 4)
          vm.countdownMessage = 'ready...?';
        else
          vm.countdownMessage = count;

        if (count-- == 0) {
          $interval.cancel(intervalHandler);
          vm.countdownMessage = '';
          scheduleNextSquare();
        }
      }, 1000);
    }

    function scheduleNextSquare() {
      $log.debug('Scheduling next square');
      var delay = Math.random() * (vm.maxDelay - vm.miDelay) + vm.miDelay;

      nextSquareTimerHandler = $timeout(function () {
        vm.lastPosition = vm.currentPosition;
        vm.currentPosition = getRandomPosition();
        renderCanvas(vm.currentPosition);
        vm.targetDetected = false;
      }, delay);
    }

    function onSquareDetected() {
      var now = new Date();
      vm.results.push({
        position: vm.currentPosition,
        positionY: getYVectorPosition(vm.currentPosition),
        positionX: getXVectorPosition(vm.currentPosition),
        duration: now.getTime() - vm.completedRenderTimestamp.getTime()
      });

      if (vm.currentPosition === 'center') {
        drawCenterSvg(vm.centerItemSize);
      }
      context.clearRect(vm.squareX - 2, vm.squareY - 2, vm.squareSize + 4, vm.squareSize + 4);
      scheduleNextSquare();
    }

    function renderCanvas(position) {
      $log.debug(position);
      switch (position) {
        case 'center':
          clearCenterItem();
          vm.squareX = (canvas.width - vm.squareSize) / 2;
          vm.squareY = (canvas.height - vm.squareSize) / 2;
          break;
        case 'left-top':
          vm.squareX = vm.padding;
          vm.squareY = vm.padding;
          drawCenterSvg(vm.centerItemSize);
          break;
        case 'left-bottom':
          vm.squareX = vm.padding;
          vm.squareY = canvas.height - vm.squareSize - vm.padding;
          drawCenterSvg(vm.centerItemSize);
          break;
        case 'right-top':
          vm.squareX = canvas.width - vm.squareSize - vm.padding;
          vm.squareY = vm.padding;
          drawCenterSvg(vm.centerItemSize);
          break;
        case 'right-bottom':
          vm.squareX = canvas.width - vm.squareSize - vm.padding;
          vm.squareY = canvas.height - vm.squareSize - vm.padding;
          drawCenterSvg(vm.centerItemSize);
          break;
        default:
          break;
      }
      drawRectangle(vm.squareX, vm.squareY, vm.squareSize);
      $log.info('completedRenderTimestamp...');
      vm.completedRenderTimestamp = new Date();
    }

    function clearCanvas() {
      $timeout(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }, 0, true);

    }

    function clearCenterItem() {
      context.clearRect((canvas.width - vm.centerItemSize) / 2, (canvas.height - vm.centerItemSize) / 2, vm.centerItemSize, vm.centerItemSize);
    }

    function drawRectangle(x, y, size) {
      context.beginPath();
      context.rect(x, y, size, size);
      context.fillStyle = vm.squareBackgroundColor;
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = vm.squareBorderColor;
      context.stroke();

    }

    function drawCenterSvg() {
      var img = new Image();
      img.src = 'assets/svg/eye.svg';
      img.onload = function () {
        context.drawImage(img, (canvas.width - vm.centerItemSize) / 2, (canvas.height - vm.centerItemSize) / 2, vm.centerItemSize, vm.centerItemSize);
      };
    }

    function resizeCanvas() {
      canvas.height = $window.innerHeight;
      canvas.width = $window.innerWidth;
    }

    $window.onresize = function () {
      resizeCanvas();
      $log.info(vm.testState);
      if (vm.testState === 'in-progress')
        renderCanvas(vm.currentPosition);
      $log.debug('resized');
    };

    $window.onkeypress = function (event) {
      if ($state.current.name === 'test' && vm.testState === 'in-progress' && !vm.targetDetected && (event.keyCode === 0 || event.keyCode === 32)) {
        event.preventDefault();
        vm.targetDetected = true;
        onSquareDetected();
      }
    }

    $document.on("webkitfullscreenchange mozfullscreenchange msfullscreenchange fullscreenchange", function () {
      vm.isFullscreen = !vm.isFullscreen;
      console.log(vm.isFullscreen);
      $scope.$apply();
      if (!vm.isFullscreen && vm.testState == 'in-progress') {
        console.log('ending test...');
        endTest();
      }

    });

    function getRandomPosition() {
      var postion = Math.floor(Math.random() * 10) % 5;
      switch (postion) {
        case 0:
          return 'center';
        case 1:
          return 'left-top';
        case 2:
          return 'left-bottom';
        case 3:
          return 'right-top';
        case 4:
          return 'right-bottom';
      }
    }

    function getXVectorPosition(position) {
      var splitted = position.split('-');
      return (splitted.length > 1 ? splitted[1] : 'center');
    }

    function getYVectorPosition(position) {
      var splitted = position.split('-');
      return (splitted.length > 1 ? splitted[0] : 'center');
    }

  }
})();
