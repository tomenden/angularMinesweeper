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

  it('should do something', function () {
    expect(game.someMethod()).toBe(42);
  });

});
