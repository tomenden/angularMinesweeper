'use strict';

describe('Factory: Game', function () {
  // load the factory's module
  beforeEach(function () {
    module('angularMinesweeperAppInternal');
  });

  // instantiate factory
  var game;
  beforeEach(inject(function (Game) {
    game = new Game();
  }));

  it('should return a 4*4 board', function () {
    var gameConf = {
      rows: 4,
      cols: 4
    };
    game.generateBoard(gameConf);
    var board = game.getBoard();
    expect(board.length).toBe(4);
    _.forEach(board, function (row) {
      expect(row.length).toBe(4);
    });
  });

});
