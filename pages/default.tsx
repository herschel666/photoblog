import { IncomingMessage } from 'http';
import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import DefaultPage, { DefaultPageProps } from '../src/pages/default/default';
import { port } from '../phox.config';

interface Args {
  req: IncomingMessage;
  query: { [key: string]: any };
}

export default class Default extends React.Component<DefaultPageProps, {}> {
  public static async getInitialProps({ req, query }: Args) {
    const host = req ? `http://localhost:${port}` : '';
    const res = await fetch(`${host}/data/${query.page}.json`);
    return res.json();
  }

  public render() {
    return <DefaultPage {...this.props} />;
  }
}
