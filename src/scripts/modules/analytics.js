
import compose from 'ramda/src/compose';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import getDomLoaded from '../util/dom-loaded';

const UA_ID = 'UA-97800946-1';

const TRACKER_NAME = '__tracker__';

const win = window;

const doc = document;

win.GoogleAnalyticsObject = TRACKER_NAME;

const tracker = win[TRACKER_NAME] = (...args) => {
    (win[TRACKER_NAME].q = win[TRACKER_NAME].q || []).push(args);
};

win[TRACKER_NAME].l = Date.now();

const loadAnalytics = () => {
    if (__DEV__) {
        return;
    }
    const elem = doc.createElement('script');
    elem.async = 1;
    elem.src = 'https://www.google-analytics.com/analytics.js';
    doc.head.appendChild(elem);
};

const initializeAnalytics = () => {
    tracker('create', UA_ID, 'auto');
    tracker('set', 'anonymizeIp', true);
};

const trackPageView = (pathname) => {
    tracker('set', 'page', pathname);
    tracker('send', 'pageview');
};

const main = () => {
    const domLoaded$ = getDomLoaded();
    domLoaded$
        .take(1)
        .subscribe(compose(initializeAnalytics, loadAnalytics));
    domLoaded$
        .map(() => location.pathname)
        .subscribe(trackPageView);
};

export default main;
