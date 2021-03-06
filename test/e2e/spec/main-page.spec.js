'use strict';

require('../lib/matchers.protractor.js');
var MainPage = require('../pages/main-page.js');
var experimentManager = require('../../../app/bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');
var biLoggerTestKit = require('../../../app/bower_components/wix-bi-logger/test/lib/driver.js');

describe('angularMinesweeperApp Main Page', function () {
  var mainPage;

  beforeEach(function () {
    mainPage = new MainPage();
    experimentManager.setExperiments({});
    browser.addMockModule('angularMinesweeperAppMocks', function () {});
  });

  afterEach(function () {
    browser.clearMockModules();
    biLoggerTestKit.assertEmpty();
  });

  it('should load successfully', function () {
    mainPage.navigate();
    expect(mainPage.getTitle().getText()).toEqual('Enjoy coding! - Yeoman');
  });

});
