/**
 * @author: @AngularClass
 */

require('ts-node/register');
var helpers = require('./helpers');

exports.config = {
  baseUrl: 'http://localhost:3000/',

  // use `npm run e2e`
  specs: [
    helpers.root('**/*.e2e.ts'),
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  multiCapabilities: [
    {
      browserName: 'chrome'
    },
    // TODO не получилось завести, разобраться, в ФФ возмонжо проблема с этим https://github.com/angular/zone.js/issues/616
    // {
    //   browserName: 'firefox'
    // },

    // {
    //   browserName: 'internet explorer',
    //   version: 'ANY',
    //   version: '11'
    // }
  ],

  onPrepare: function () {
    browser.ignoreSynchronization = true;
  },
  seleniumArgs: ['-Dwebdriver.ie.driver=node_modules/protractor/selenium/IEDriverServer.exe'],

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   */
  useAllAngular2AppRoots: true
};
