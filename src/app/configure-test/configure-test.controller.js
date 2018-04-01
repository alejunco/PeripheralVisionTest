(function () {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .controller('ConfigureTestController', ConfigureTestController);

  ConfigureTestController.$inject = ['$log', 'TestConfigService'];

  function ConfigureTestController($log, TestConfigService) {
    var vm = this;
    vm.title = 'Configuration'
    vm.saveConfig = saveConfig;
    vm.colorPickerOptions = {

      // color
      format: 'hexString'
    }
    vm.slider = {
      minValue: 0.5,
      maxValue: 6,
      options: {
        floor: 0,
        ceil: 5,
        step: .25,
        precision: 2,
        pushRange: true
      }
    };


    activate();

    ////////////////

    function activate() {
      loadConfig();
    }

    function loadConfig() {
      TestConfigService.load()
      vm.padding = TestConfigService.padding;
      vm.centerItemSize = TestConfigService.centerItemSize;
      vm.squareSize = TestConfigService.squareSize;
      vm.squareBackgroundColor = TestConfigService.squareBackgroundColor;
      vm.squareBorderColor = TestConfigService.squareBorderColor;
      vm.slider.minValue = TestConfigService.miDelay / 1000;
      vm.slider.maxValue = TestConfigService.maxDelay / 1000;
    }

    function saveConfig() {
      TestConfigService.padding = vm.padding;
      TestConfigService.centerItemSize = vm.centerItemSize;
      TestConfigService.squareSize = vm.squareSize;
      TestConfigService.squareBackgroundColor = vm.squareBackgroundColor;
      TestConfigService.squareBorderColor = vm.squareBorderColor;
      TestConfigService.miDelay = vm.slider.minValue * 1000;
      TestConfigService.maxDelay = vm.slider.maxValue * 1000;
      TestConfigService.save();
    }
  }
})();
