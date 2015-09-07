'use strict';

(function () {

  /* @ngInject */
  function GameFactory() {
    function Game() {
      var meaningOfLife = 42;

      this.someMethod = function () {
        return meaningOfLife;
      };
    }

    return Game;
  }

  angular
    .module('angularMinesweeperAppInternal')
    .factory('Game', GameFactory);

})();
