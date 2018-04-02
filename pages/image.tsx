import { IncomingMessage } from 'http';
import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import ImagePage, { ImagePageProps } from '../src/pages/image/image';
import { getCdnUrl, getLocalServerUrl } from '../src/util';

interface Args {
  req: IncomingMessage;
  query: { [key: string]: any };
}

export default class Image extends React.Component<ImagePageProps> {
  public static async getInitialProps({ req, query }: Args) {
    const rootUrl = req ? getLocalServerUrl() : getCdnUrl();
    const res = await fetch(
      `${rootUrl}data/sets/${query.album}/${query.image}.json`
    );
    return res.json();
  }

  public render() {
    return <ImagePage {...this.props} />;
  }
}
