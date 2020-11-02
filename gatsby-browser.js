/* eslint-env browser */
const { config } = require('@fortawesome/fontawesome-svg-core');
require('@fortawesome/fontawesome-svg-core/styles.css');

config.autoAddCss = false;

const trackPageView = () => {
  if (
    process.env.NODE_ENV !== 'development' &&
    typeof window.track === 'function'
  ) {
    window.track(window);
  }
};

exports.onClientEntry = () => {
  trackPageView();
};

exports.onRouteUpdate = ({ prevLocation }) => {
  if (prevLocation !== null) {
    trackPageView();
  }
};
