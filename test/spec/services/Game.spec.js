'use strict';

describe('Factory: Game', function () {
  // load the factory's module
  beforeEach(function () {
    module('angularMinesweeperAppInternal');
  });
  function getCoordinatesFromIndex(index) {
    return {
      x: index % gameConf.rows,
      y: Math.floor(index / gameConf.cols)
    };
  }

  // instantiate factory
  var game, gameConf;
  describe('generateBoard', function () {
    beforeEach(inject(function (Game) {
      gameConf = {
        rows: 5,
        cols: 5,
        mines: 3
      };
      game = new Game(gameConf);
    }));
    it('should create a board with 25 cells (5*5)', function () {
      game.generateBoard();
      var board = game.getBoard();
      expect(_.flatten(board).length).toBe(25);
    });
    it('should create a 5*5 board with 3 mines and 22 free cells', function () {
      var count;
      game.generateBoard();
      var board = game.getBoard();
      count = _.countBy(_.flatten(board), 'mine');
      expect(count.true).toBe(3);
      expect(count.false).toBe(22);
    });
  });

  describe('reveal', function () {
    var board;
    var minesIndices;
    beforeEach(inject(function (Game) {
      gameConf = {
        rows: 3,
        cols: 3,
        mines: 1
      };
      game = new Game(gameConf);

    }));
    it('should indicate that game is ended and lost in case a mine is revealed', function () {
      minesIndices = [4];
      game.generateBoard(minesIndices);
      board = game.getBoard();
      var coordinates = getCoordinatesFromIndex(minesIndices[0]);
      game.reveal(coordinates.x, coordinates.y);
      var status = game.getGameStatus();
      expect(status.ended).toBe(true);
      expect(status.result).toBe(-1);
    });
    it('should indicate that game is ended and won in case the last unrevealed clear cell is revealed', function () {
      minesIndices = [4];
      game.generateBoard(minesIndices);
      board = game.getBoard();
      var indicesExceptLast = [0, 1, 2, 3, 5, 6, 7];
      var lastIndexCoordinates = getCoordinatesFromIndex(8);
      _.forEach(indicesExceptLast, function (index) {
        var coordinates = getCoordinatesFromIndex(index);
        game.reveal(coordinates.x, coordinates.y);
      });
      expect(game.getGameStatus().ended).toBe(false);
      game.reveal(lastIndexCoordinates.x, lastIndexCoordinates.y);
      expect(game.getGameStatus().ended).toBe(true);
      expect(game.getGameStatus().result).toBe(1);
    });
    it('should reveal the neighboring cells', function () {
      minesIndices = [8];
      game.generateBoard(minesIndices);
      board = game.getBoard();
      var coordinates = getCoordinatesFromIndex(0);
      game.reveal(coordinates.x, coordinates.y);
      var neighborsCoordinates = [{y: 0, x: 1}, {y: 1, x: 0}, {y: 1, x: 1}].map(function (coordinates) {
        return board[coordinates.y][coordinates.x];
      });
      expect(_.every(neighborsCoordinates, 'revealed', false)).toBe(true);
    });
  });
});
