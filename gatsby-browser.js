/* eslint-env browser */
const { config } = require('@fortawesome/fontawesome-svg-core');
require('@fortawesome/fontawesome-svg-core/styles.css');

config.autoAddCss = false;

exports.onClientEntry = () => {
  window.track(window);
};

exports.onRouteUpdate = ({ prevLocation }) => {
  if (prevLocation !== null) {
    window.track(window);
  }
};
