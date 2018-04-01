(function () {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $rootScope) {
    var vm = this;
    vm.title = 'Home'

    activate();

    function activate() {
      $rootScope.navbarIsVisible = true;
    }

  }
})();
