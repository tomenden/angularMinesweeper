'use strict';

(function () {

  /* @ngInject */
  function GameController($scope, Game) {
    var self = this;
    var currentGame;

    this.inProgress = false;
    $scope.gameConf = {};

    this.startGame = function () {
      currentGame = new Game($scope.gameConf);
      currentGame.generateBoard();
      self.inProgress = true;
      self.board = currentGame.getBoard();
    };

    this.reveal = function (x, y) {
      currentGame.reveal(x, y);
    };
    this.toggleFlag = function (x, y) {
      if (!self.board[y][x].revealed) {
        currentGame.toggleFlag(x, y);
      }

    };

    $scope.$watch(function () {
      return currentGame && currentGame.getGameStatus().result;
    }, function (newVal) {
      if (newVal === 1) {
        alert('you win!');
      }
      if (newVal === -1) {
        alert('you lose!');
      }
    });
  }

  angular
    .module('angularMinesweeperAppInternal')
    .controller('GameController', GameController);

})();
