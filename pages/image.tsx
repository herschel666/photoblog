import { IncomingMessage } from 'http';
import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import ImagePage, { ImagePageProps } from '../src/pages/image/image';
import { port } from '../phox.config';

interface Args {
  req: IncomingMessage;
  query: { [key: string]: any };
}

export default class Image extends React.Component<ImagePageProps> {
  public static async getInitialProps({ req, query }: Args) {
    const host = req ? `http://localhost:${port}` : '';
    const res = await fetch(
      `${host}/data/sets/${query.album}/${query.image}.json`
    );
    return res.json();
  }

  public render() {
    return <ImagePage {...this.props} />;
  }
}
