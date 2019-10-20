exports.config = {
  runner: 'local',
  path: '/',
  specs: ['./integration/wdio/*.js'],
  exclude: [],
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu', '--no-sandbox'],
      },
    },
    // {
    //   maxInstances: 5,
    //   browserName: 'firefox',
    //   'moz:firefoxOptions': {
    //     args: ['-headless'],
    //   },
    // },
  ],
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'silent',
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: process.env.CI === undefined ? 0 : 1,
  sync: false,
  baseUrl: 'http://localhost:8000',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['chromedriver'],
  framework: 'jasmine',
  reporters: ['spec'],
};
