const React = require('react');

function track(win) {
  const pixel = 'https://analytics.e5l.de/cctv.gif';
  const trackingId =
    'b5e310247689f41ca09583015c02338479d8023a9ab864e8b216daea9300305b_1280a60ce28d3769d28a21b0e647be11';
  const { pathname, search } = win.location;
  const resource = encodeURIComponent(pathname + search);
  const referrer = encodeURIComponent(win.document.referrer);
  const src = `${pixel}?id=${trackingId}&resource=${resource}&referrer=${referrer}`;
  Object.assign(new win.Image(), { src });
}

exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    React.createElement('script', {
      dangerouslySetInnerHTML: { __html: track.toString() },
    }),
  ]);
};
