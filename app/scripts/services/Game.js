'use strict';

(function () {

  /* @ngInject */
  function GameFactory() {


    /**
     *
     * @param gameConf Object: {rows:number, cols:number, mines:number}
     */
    function Game(gameConf) {
      gameConf = gameConf || {rows: 1, cols: 3, mines: 1};
      var board;
      var gameStatus = {
        ended: false,
        result: 0
      };
      var unrevealedClearCellsCount;

      function isValidCellCoordinates(x, y) {
        return !!(board[y] && board[y][x]);
        //return _.has(board, 'y.x');
      }

      function getBoard() {
        return board;
      }


      function getNeighborsCoordinates(x, y) {
        var possibleRows = [y, y + 1, y - 1];
        var possibleCols = [x, x + 1, x - 1];
        var neighborsCoordinates = [];
        //TODO: consider refactoring this and decide between working with multi-dimensional array vs. flat
        _.forEach(possibleRows, function (row) {
          _.forEach(possibleCols, function (col) {
            if (isValidCellCoordinates(col, row) && !(col === x && row === y)) {
              neighborsCoordinates.push({
                x: col,
                y: row
              });
            }
          });
        });
        return neighborsCoordinates;
      }


      function isLastClearCell() {
        return unrevealedClearCellsCount === 1;
      }

      //todo: refactor
      function reveal(x, y) {
        var cell = board[y][x];
        var neighbors, neighborsCoordinates, neighborMinesCount;
        if (cell.flagged === true) {
          return;
        }
        cell.revealed = true;
        if (cell.mine === true) {
          gameStatus.ended = true;
          gameStatus.result = -1;
          return 'You lose';
        } else {
          if (isLastClearCell()) {
            unrevealedClearCellsCount--;
            gameStatus.ended = true;
            gameStatus.result = 1;
            return 'You won!';
          }
          unrevealedClearCellsCount--;
          neighborsCoordinates = getNeighborsCoordinates(x, y);
          neighbors = _.map(neighborsCoordinates, function (coordinates) {
            return board[coordinates.y][coordinates.x];
          });
          neighborMinesCount = _.countBy(neighbors, 'mine').true || 0;
          if (neighborMinesCount === 0) {
            _.forEach(neighborsCoordinates, function (coordinates, index) {
              if (neighbors[index].revealed = false) {
                reveal(coordinates.x, coordinates.y);
              }
            });
          } else {
            return neighborMinesCount;
          }
        }
      }

      function getGameStatus() {
        return gameStatus;
      }

      function toggleFlag(x, y) {
        if (isValidCellCoordinates(x, y)) {
          board[y][x].flagged = true;
        }
      }

      function generateBoard(minesFlatIndices) {
        var totalNumberOfCells = gameConf.rows * gameConf.cols;
        var allCellsIndices = _.range(totalNumberOfCells);
        minesFlatIndices = minesFlatIndices || _(allCellsIndices).shuffle().slice(0, gameConf.mines).value();
        board = _(allCellsIndices).map(function (index) {
          var cell = {
            mine: false,
            flagged: false,
            revealed: false
          };
          if (_.includes(minesFlatIndices, index)) {
            cell.mine = true;
          }
          return cell;
        })
          .chunk(gameConf.cols)
          .value();
        unrevealedClearCellsCount = totalNumberOfCells - gameConf.mines;
      }

      this.generateBoard = generateBoard;
      this.getBoard = getBoard;
      this.reveal = reveal;
      this.getGameStatus = getGameStatus;
      this.toggleFlag = toggleFlag;
    }

    return Game;
  }

  angular
    .module('angularMinesweeperAppInternal')
    .factory('Game', GameFactory);

})();
