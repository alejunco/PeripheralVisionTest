(function () {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('configure', {
        url: '/configure',
        templateUrl: 'app/configure-test/configure-test.html',
        controller: 'ConfigureTestController',
        controllerAs: 'vm'
      })
      .state('test', {
        url: '/test',
        templateUrl: 'app/peripheral-test/peripheral-test.html',
        controller: 'PeripheralTestController',
        controllerAs: 'vm'
      })
      .state('results', {
        url: '/results',
        params: {
          testResult: null
        },
        templateUrl: 'app/test-results/test-results.html',
        controller: 'TestResultsController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
