'use strict';

(function () {

  /* @ngInject */
  function rightClick() {
    return {
      // TODO: add scope
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('contextmenu', function (event) {
          event.preventDefault();
          scope.$apply(attrs.rightClick);
        })
      }
    };
  }

  angular
    .module('angularMinesweeperAppInternal')
    .directive('rightClick', rightClick);

})();
