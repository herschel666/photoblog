import { IncomingMessage } from 'http';
import * as React from 'react';
import phox from 'phox/typings';
import * as fetch from 'isomorphic-fetch';
import IndexPage from '../src/pages/index/index';
import { getCdnUrl, getLocalServerUrl } from '../src/util';

interface Args {
  req: IncomingMessage;
}

export default class Index extends React.Component<phox.FrontpageApiData> {
  public static async getInitialProps({ req }: Args) {
    const rootUrl = req ? getLocalServerUrl() : getCdnUrl();
    const res = await fetch(`${rootUrl}data/index.json`);
    return res.json();
  }

  public render() {
    return <IndexPage {...this.props} />;
  }
}
