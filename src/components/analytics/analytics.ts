import * as React from 'react';
import { isDevEnv, windowIsDefined } from '../../util';

interface AnalyticsInterface {
  page: string;
  children: React.ReactChild;
}

const UA_ID = 'UA-97800946-1';
const TRACKER_NAME = '__tracker__';

const intermediate = (...args: any[]): void => {
  window[TRACKER_NAME].q = window[TRACKER_NAME].q || [];
  window[TRACKER_NAME].q.push(args);
};

export default class Analytics extends React.Component<AnalyticsInterface> {
  private gaLoaded: boolean = false;

  private noGaNeeded = (): boolean => {
    return !windowIsDefined() || isDevEnv() || this.gaLoaded;
  };

  private initializeGa = (): void => {
    if (this.noGaNeeded()) {
      return;
    }
    window.GoogleAnalyticsObject = TRACKER_NAME;
    window[TRACKER_NAME] = window[TRACKER_NAME] || intermediate;
    window[TRACKER_NAME].l = window[TRACKER_NAME].l || Date.now();
    window[TRACKER_NAME]('create', UA_ID, 'auto');
    window[TRACKER_NAME]('set', 'anonymizeIp', true);
  };

  private loadGa = (): void => {
    if (this.noGaNeeded()) {
      return;
    }
    const elem = document.createElement('script');
    elem.async = true;
    elem.src = 'https://www.google-analytics.com/analytics.js';
    document.head.appendChild(elem);
  };

  private pageView = (page: string): void => {
    if (windowIsDefined() && window[TRACKER_NAME]) {
      window[TRACKER_NAME]('set', 'page', page);
      window[TRACKER_NAME]('send', 'pageview');
      return;
    }
    // tslint:disable-next-line no-console
    console.log('pageview', page);
  };

  public componentWillMount(): void {
    this.initializeGa();
    this.loadGa();
    this.pageView(this.props.page);
  }

  public componentWillReceiveProps(nextProps: AnalyticsInterface): void {
    if (nextProps.page !== this.props.page) {
      this.pageView(nextProps.page);
    }
  }

  public render() {
    return React.Children.only(this.props.children);
  }
}
