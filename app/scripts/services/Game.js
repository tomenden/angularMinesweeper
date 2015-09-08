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
        //return board[y] && board[y][x];
        return _.has(board, 'y.x');
      }

      function getBoard() {
        return board;
      }


      function getNeighborsFromCoordinates(x, y) {
        var possibleRows = [y, y + 1, y - 1];
        var possibleCols = [x, x + 1, x - 1];
        var neighbors = [];
        //TODO: consider refactoring this and decide between working with multi-dimensional array vs. flat
        _.forEach(possibleRows, function (row) {
          _.forEach(possibleCols, function (col) {
            if (isValidCellCoordinates(col, row) && !(col === x && row === y)) {
              neighbors.push(board[x][y]);
            }
            //if ((col === x && row === y) ||
            //  col < 0 || row < 0 ||
            //  row > gameConf.rows ||
            //  col > gameConf.cols) {
            //  return;
            //}
            //var candidateIndex = getIndexFromCoordinates(col, row);
            //if (isValidCellCoordinates(candidateIndex)) {
            //  neighborsIndices.push(board[candidateIndex]);
            //}
          });
        });
        return neighbors;
      }

      //function getNeighbors(cellIndex) {
      //  var possibleOffsets = [-1, 1, -gameConf.cols + 1, -gameConf.cols, -gameConf.cols - 1, gameConf.cols, gameConf.cols - 1, gameConf.cols + 1];
      //  return _(possibleOffsets).map(function (offset) {
      //    var candidateIndex = cellIndex + offset;
      //    return  isValidIndex(candidateIndex) ?
      //      candidateIndex :
      //      null;
      //  }).compact().value();
      //}

      //function getIndexFromCoordinates(x, y) {
      //  return x + (y * gameConf.cols);
      //}

      function reveal(x, y) {
        //var cellIndex = getIndexFromCoordinates(x, y);
        var cell = board[y][x];
        var neighbors, neighborMinesCount;
        cell.revealed = true;
        if (cell.mine) {
          gameStatus.ended = true;
          gameStatus.result = -1;
          return 'You lose';
        } else {
          if (unrevealedClearCellsCount === 1) {
            unrevealedClearCellsCount--;
            gameStatus.ended = true;
            gameStatus.result = 1;
            return 'You won!';
          }
          unrevealedClearCellsCount--;
          neighbors = getNeighborsFromCoordinates(x, y);
          neighborMinesCount = _.countBy(neighbors, 'mine').true || 0;
          if (neighborMinesCount === 0) {
            _.forEach(neighbors, function (cell) {
              reveal(cell);
            });
          } else {
            return neighborMinesCount;
          }
        }
      }

      function getGameStatus() {
        return gameStatus;
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
    }

    return Game;
  }

  angular
    .module('angularMinesweeperAppInternal')
    .factory('Game', GameFactory);

})();
