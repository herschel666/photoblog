const React = require('react');

function track(win) {
  const pixel = 'https://analytics.e5l.de/cctv.gif';
  const trackingId =
    'f6ebcbdcc4353680520f8568746a882a56058f72754dfff2d953b89409ccf48f_6d6f6758976cf3c94611a1778c3eb0b1';
  const { pathname, search, hostname } = win.location;
  if (hostname === 'localhost') {
    return;
  }
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
