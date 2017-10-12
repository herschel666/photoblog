import { IncomingMessage } from 'http';
import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import TagPage, { TagPageProps } from '../src/pages/tag/tag';
import { port } from '../phox.config';

interface Args {
  req: IncomingMessage;
  query: { [tag: string]: any };
}

export default class Tag extends React.Component<TagPageProps, {}> {
  public static async getInitialProps({ req, query }: Args) {
    const host = req ? `http://localhost:${port}` : '';
    const res = await fetch(`${host}/data/tag/${query.tag}.json`);
    return res.json();
  }

  public render() {
    return <TagPage {...this.props} />;
  }
}
