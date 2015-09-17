'use strict';

describe('Directive: rightClick', function () {

  // load the directive's module
  beforeEach(function () {
    module('angularMinesweeperAppInternal');
  });

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    scope.flag = function () {
    };
    spyOn(scope, 'flag');
  }));

  it('should call the flag function on the scope when right clicked', inject(function ($compile) {
    element = angular.element('<div right-click="flag(0,0)"></div>');
    element = $compile(element)(scope);
    element.triggerHandler('contextmenu');
    expect(scope.flag).toHaveBeenCalledWith(0, 0);
  }));
});
