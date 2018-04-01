(function () {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .controller('TestResultsController', TestResultsController);

  TestResultsController.$inject = ['$log', '$state', '$stateParams'];

  function TestResultsController($log, $state, $stateParams) {
    var vm = this;
    vm.title = 'Test Results';

    vm.data = null;
    vm.allPositions = null;

    activate();

    ////////////////

    function activate() {
      $log.info($stateParams);
      $log.info(_);

      loadData();

      // loadMockData();

      if (!vm.data)
        $state.go('home');

      if (canBuildReport())
        buildReports();
    }

    function processData() {
      var positions = _.groupBy(vm.data, 'position');
      var positionsX = _.groupBy(vm.data, 'positionX');
      var positionsY = _.groupBy(vm.data, 'positionY');
      $log.info(positions);
      $log.info(positionsX);
      $log.info(positionsY);

      var extendedPositions = _.extend({}, positions, positionsX, positionsY);
      $log.info('Extended Positions:');
      $log.info(extendedPositions);
      var result = _.mapObject(extendedPositions, function (val, key) {
        return {
          average: _.reduce(val, function (memo, v) {
            return memo + v.duration;
          }, 0) / val.length,
          total: val.length,
          values: val
        }
      });
      $log.info(result);
      vm.result = result;
    }

    function loadAllPositions() {
      vm.allPositions = [{
          id: 'center',
          name: 'Center'
        },
        {
          id: 'left-top',
          name: 'Upper Left'
        }, {
          id: 'right-top',
          name: 'Upper Right'
        }, {
          id: 'left-bottom',
          name: 'Lower Left'
        }, {
          id: 'right-bottom',
          name: 'Lower Right'
        }, {
          id: 'top',
          name: 'Upper (Both)'
        }, {
          id: 'bottom',
          name: 'Lower (Both)'
        }, {
          id: 'right',
          name: 'Right (Both)'
        }, {
          id: 'left',
          name: 'Left (Both)'
        }
      ]
    }

    function configureAllValuesReport() {
      vm.allValuesReportColumns = [];
      vm.allValuesReportColumns.push(vm.allPositions[0]);
      vm.allValuesReportColumns.push(vm.allPositions[1]);
      vm.allValuesReportColumns.push(vm.allPositions[2]);
      vm.allValuesReportColumns.push(vm.allPositions[3]);
      vm.allValuesReportColumns.push(vm.allPositions[4]);
    }

    function loadMockData() {
      vm.data = [{
          "position": "left-top",
          "positionY": "left",
          "positionX": "top",
          "duration": 361
        },
        {
          "position": "left-bottom",
          "positionY": "left",
          "positionX": "bottom",
          "duration": 334
        },
        {
          "position": "left-bottom",
          "positionY": "left",
          "positionX": "bottom",
          "duration": 332
        },
        {
          "position": "right-bottom",
          "positionY": "right",
          "positionX": "bottom",
          "duration": 395
        },
        {
          "position": "right-bottom",
          "positionY": "right",
          "positionX": "bottom",
          "duration": 354
        },
        {
          "position": "left-top",
          "positionY": "left",
          "positionX": "top",
          "duration": 367
        },
        {
          "position": "center",
          "positionY": "center",
          "positionX": "center",
          "duration": 567
        },
        {
          "position": "right-bottom",
          "positionY": "right",
          "positionX": "bottom",
          "duration": 624
        },
        {
          "position": "right-top",
          "positionY": "right",
          "positionX": "top",
          "duration": 397
        },
        {
          "position": "left-top",
          "positionY": "left",
          "positionX": "top",
          "duration": 273
        },
        {
          "position": "center",
          "positionY": "center",
          "positionX": "center",
          "duration": 35
        },
        {
          "position": "center",
          "positionY": "center",
          "positionX": "center",
          "duration": 329
        },
        {
          "position": "left-top",
          "positionY": "left",
          "positionX": "top",
          "duration": 373
        },
        {
          "position": "left-bottom",
          "positionY": "left",
          "positionX": "bottom",
          "duration": 380
        },
        {
          "position": "left-bottom",
          "positionY": "left",
          "positionX": "bottom",
          "duration": 387
        },
        {
          "position": "left-top",
          "positionY": "left",
          "positionX": "top",
          "duration": 335
        },
        {
          "position": "left-bottom",
          "positionY": "left",
          "positionX": "bottom",
          "duration": 359
        },
        {
          "position": "center",
          "positionY": "center",
          "positionX": "center",
          "duration": 267
        },
        {
          "position": "left-top",
          "positionY": "left",
          "positionX": "top",
          "duration": 312
        }
      ];

    }

    function loadData() {
      vm.data = $stateParams.testResult;
    }

    function buildReports() {
      processData();
      loadAllPositions();
      configureAllValuesReport();
    }

    function canBuildReport() {
      if (vm.data === null || vm.data.length < 1) {
        console.log('Report not available');
        vm.reportNotAvailable = true;
        return false;
      } else {
        vm.reportNotAvailable = false;
        return true;
      }

    }


  }
})();
