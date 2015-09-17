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
      var unrevealedClearCellsCount = gameConf.rows * gameConf.cols - gameConf.mines;

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

      function isWin() {
        return unrevealedClearCellsCount === 0 && gameStatus.result === 0;
      }

      function loseGame() {
        gameStatus.ended = true;
        gameStatus.result = -1;
      }

      function winGame() {
        gameStatus.ended = true;
        gameStatus.result = 1;
      }

      function getCellFromCoordinatesObject(coordinates) {
        return board[coordinates.y][coordinates.x];
      }

      function revealCoordinatesArray(coordinatesArray) {
        _.forEach(coordinatesArray, function (coordinates) {
            reveal(coordinates.x, coordinates.y);
        });
      }

      function revealPropagation(x, y) {
        var cell = board[y][x];
        var neighbors, neighborsCoordinates, neighborMinesCount;
        neighborsCoordinates = getNeighborsCoordinates(x, y);
        neighbors = _.map(neighborsCoordinates, getCellFromCoordinatesObject);
        neighborMinesCount = _.countBy(neighbors, 'mine').true || 0;
        if (neighborMinesCount === 0) {
          revealCoordinatesArray(neighborsCoordinates);
        }
        cell.neighborMinesCount = neighborMinesCount;
      }

      function reveal(x, y) {
        var cell = board[y][x];
        if (!cell.flagged && !cell.revealed){
          cell.revealed = true;
          unrevealedClearCellsCount--;
          if (cell.mine) {
            loseGame();
          } else {
            revealPropagation(x, y);
          }

        }
      }

      function getGameStatus() {
        return gameStatus;
      }

      function toggleFlag(x, y) {
        if (isValidCellCoordinates(x, y) && board[y][x].revealed === false) {
          var cell = board[y][x];
          cell.flagged = !cell.flagged;
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
        //unrevealedClearCellsCount = totalNumberOfCells - gameConf.mines;
      }

      this.generateBoard = generateBoard;
      this.getBoard = getBoard;
      this.reveal = function (x,y){
        reveal(x,y);
        if (isWin()) {
          winGame();
        }
      };
      this.getGameStatus = getGameStatus;
      this.toggleFlag = toggleFlag;
    }

    return Game;
  }

  angular
    .module('angularMinesweeperAppInternal')
    .factory('Game', GameFactory);

})();
