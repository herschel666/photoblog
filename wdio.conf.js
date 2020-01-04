const whitelistedIps = (() => {
  try {
    const ips = require('./whitelisted-ips.json');
    return ips.join(',');
  } catch (e) {
    return '';
  }
})();

exports.config = {
  runner: 'local',
  path: '/',
  specs: ['./integration/*.js'],
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
        args: [
          'headless',
          'disable-gpu',
          'no-sandbox',
          `whitelisted-ips=${whitelistedIps}`,
        ],
      },
    },
  ],
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'silent',
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
