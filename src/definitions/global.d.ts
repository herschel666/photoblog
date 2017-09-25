interface DisqusResetArgs {
  reload: boolean;
  config?: () => void;
}

interface Window {
  DISQUS?: { reset: (args: DisqusResetArgs) => void };
  disqus_config?: any;
}

interface UrlObject {
  pathname: string;
  query?: { [x: string]: string };
}
