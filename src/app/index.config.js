(function() {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
  }

})();
