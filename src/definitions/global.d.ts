declare var CDN_URL: string;
declare var LOCAL_SERVER_URL: string;

interface DisqusResetArgs {
  reload: boolean;
  config?: () => void;
}

interface Tracker {
  (...args: any[]): void;
  q?: any[];
  l?: number;
}

interface Window {
  GoogleAnalyticsObject: string;
  __tracker__: Tracker;
  DISQUS?: { reset: (args: DisqusResetArgs) => void };
  disqus_config?: any;
}

interface UrlObject {
  pathname: string;
  query?: { [x: string]: string };
}
