import { IncomingMessage } from 'http';
import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import AlbumPage, { AlbumPageProps } from '../src/pages/album/album';
import { getCdnUrl, getLocalServerUrl } from '../src/util';

interface Args {
  req: IncomingMessage;
  query: { [key: string]: any };
}

export default class Album extends React.Component<AlbumPageProps> {
  public static async getInitialProps({ req, query }: Args) {
    const rootUrl = req ? getLocalServerUrl() : getCdnUrl();
    const res = await fetch(`${rootUrl}data/sets/${query.album}.json`);
    return res.json();
  }

  public render() {
    return <AlbumPage {...this.props} />;
  }
}
