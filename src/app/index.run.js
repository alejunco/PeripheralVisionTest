(function () {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope) {
    $log.debug('runBlock end');

    var navbarIsVisible = {
      'padding-top': '90px'
    };

    var navbarNotVisible = {
      'padding-top': '0',
      'background-color': '#060606'
    };

    var stateChangeHandler = $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (toState.name == 'test') {
        $rootScope.bodyStyleObject = navbarNotVisible;
      } else {
        $rootScope.bodyStyleObject = navbarIsVisible;
      }
    });

    $rootScope.$on('$destroy', stateChangeHandler)
  }

})();
