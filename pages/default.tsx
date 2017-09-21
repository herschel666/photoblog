import { IncomingMessage } from 'http';
import * as React from 'react';
import phox from 'phox/typings';
import * as fetch from 'isomorphic-fetch';
import DefaultPage from '../src/pages/default/default';
import { port } from '../phox.config';

interface Args {
  req: IncomingMessage;
  query: { [key: string]: any };
}

export default class Default extends React.Component<phox.PageApiData, {}> {
  public static async getInitialProps({ req, query }: Args) {
    const host = req ? `http://localhost:${port}` : '';
    const res = await fetch(`${host}/data/${query.page}.json`);
    return res.json();
  }

  public render() {
    return <DefaultPage {...this.props} />;
  }
}
