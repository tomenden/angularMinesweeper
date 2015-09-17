'use strict';

describe('Controller: GameController', function () {

  // load the controller's module
  beforeEach(function () {
    module('angularMinesweeperAppInternal');
  });

  var GameController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GameController = $controller('GameController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the controller', function () {
    //expect(GameController.awesomeThings.length).toBe(6);
  });
});
