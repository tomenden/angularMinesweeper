'use strict';

(function () {

  /* @ngInject */
  function GameFactory() {
    function Game() {
      var board;

      function isValidCell(row, col) {
        return board[row] && board[row][col];
      }

      function getBoard() {
        return board;
      }

      function getCell(row, col) {
        var cellContent = board[row][col];
        return {
          isMine: function () {
            return cellContent === 'X';
          },
          getNeighbors: function () {
            var neighbors = [];
            var possibleRows = [row - 1, row, row + 1];
            var possibleCols = [col - 1, col, col + 1];

            _.forEach(possibleRows, function (currentRow) {
              _.forEach(possibleCols, function (currentCol) {
                if (isValidCell(currentRow, currentCol)) {
                  neighbors.push(getCell(currentRow, currentCol));
                }
              });
            });

            return neighbors;
          }
        };
      }

      function reveal(row, col) {
        var cell = getCell(row, col);
        if (cell.isMine()) {
          console.log('you lose');
        }
      }

      /**
       *
       * @param gameConf Object: {rows:number, cols:number, mines:number}
       */
      function generateBoard(gameConf) {
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
      }

      this.generateBoard = generateBoard;
      this.getBoard = getBoard;
      this.reveal = reveal;
      this.getCell = getCell;
    }

    return Game;
  }

  angular
    .module('angularMinesweeperAppInternal')
    .factory('Game', GameFactory);

})();
