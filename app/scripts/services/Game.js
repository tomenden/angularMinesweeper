'use strict';

(function () {

  /* @ngInject */
  function GameFactory() {
    function Game() {
      var board;
      /**
       *
       * @param gameConf Object: {rows:number, cols:number, mines:number}
       */
      this.generateBoard = function (gameConf) {
        var totalNumberOfCells = gameConf.rows * gameConf.cols;
        var clearCells = _.range(totalNumberOfCells);
        var minesCells = [];
        _.times(gameConf.mines, function () {
          clearCells = _.shuffle(clearCells);
          minesCells.push(clearCells.pop());
        });

        board = _(totalNumberOfCells).times(function (currentCell) {
          return _.includes(minesCells, currentCell) ? 'X' : '-';
        })
          .chunk(gameConf.cols)
          .value();
      };

      this.getBoard = function() {
        return board;
      };
    }

    return Game;
  }

  angular
    .module('angularMinesweeperAppInternal')
    .factory('Game', GameFactory);

})();
