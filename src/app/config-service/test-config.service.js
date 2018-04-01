(function () {
  'use strict';

  angular
    .module('peripheralVisionTest')
    .service('TestConfigService', TestConfigService);

  TestConfigService.$inject = ['$log'];

  function TestConfigService($log) {
    this.padding = 10;
    this.centerItemSize = 60;
    this.squareSize = 20;
    this.squareBackgroundColor = '#fefefe';
    this.squareBorderColor = 'black';
    this.miDelay = 1500; //milliseconds
    this.maxDelay = 2000; //milliseconds
    this.save = save;
    this.load = load;

    function save() {
      localStorage.setItem('periphericalConfig', JSON.stringify({
        spadding: this.padding,
        scenterItemSize: this.centerItemSize,
        ssquareSize: this.squareSize,
        ssquareBackgroundColor: this.squareBackgroundColor,
        ssquareBorderColor: this.squareBorderColor,
        smiDelay: this.miDelay,
        smaxDelay: this.maxDelay,
      }))
    }

    function load() {
      var configString = localStorage.getItem('periphericalConfig');
      var config = JSON.parse(configString);
      if (!config) {
        this.padding = 10;
        this.centerItemSize = 60;
        this.squareSize = 20;
        this.squareBackgroundColor = '#fefefe';
        this.squareBorderColor = 'black';
        this.miDelay = 1500; //milliseconds
        this.maxDelay = 2000; //milliseconds
      } else {
        this.padding = config.spadding ? config.spadding : 10;
        this.centerItemSize = config.scenterItemSize ? config.scenterItemSize : 60;
        this.squareSize = config.ssquareSize ? config.ssquareSize : 20;
        this.squareBackgroundColor = config.ssquareBackgroundColor ? config.ssquareBackgroundColor : '#fefefe';
        this.squareBorderColor = config.ssquareBorderColor ? config.ssquareBorderColor : 'black';
        this.miDelay = config.smiDelay ? config.smiDelay : 1500; //milliseconds
        this.maxDelay = config.smaxDelay ? config.smaxDelay : 2000; //milliseconds
      }

    }
  }
})();
