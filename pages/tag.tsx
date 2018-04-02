import { IncomingMessage } from 'http';
import * as React from 'react';
import * as fetch from 'isomorphic-fetch';
import TagPage, { TagPageProps } from '../src/pages/tag/tag';
import { getCdnUrl, getLocalServerUrl } from '../src/util';

interface Args {
  req: IncomingMessage;
  query: { [tag: string]: any };
}

export default class Tag extends React.Component<TagPageProps> {
  public static async getInitialProps({ req, query }: Args) {
    const rootUrl = req ? getLocalServerUrl() : getCdnUrl();
    const res = await fetch(`${rootUrl}data/tag/${query.tag}.json`);
    return res.json();
  }

  public render() {
    return <TagPage {...this.props} />;
  }
}
