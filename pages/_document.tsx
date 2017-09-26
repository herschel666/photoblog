import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { StyleSheetServer } from 'aphrodite';

// tslint:disable-next-line
const stylesheet = require('styles/global.css');

interface Args {
  renderPage: () => string;
}

interface Props {
  __NEXT_DATA__?: any;
  ids: string[];
  chunks?: string[];
  head?: React.ReactElement<any>[];
  [key: string]: any;
}

export default class MyDocument extends Document {
  public static async getInitialProps({ renderPage }: Args) {
    const { html, css } = StyleSheetServer.renderStatic(renderPage);
    const ids = css.renderedClassNames;
    const obj = typeof html === 'string' ? { html } : html;
    return { ...obj, css, ids };
  }

  constructor(props: Props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = this.props.ids;
    }
  }

  public render() {
    return (
      <html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimal-ui"
          />
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <style
            data-aphrodite
            dangerouslySetInnerHTML={{ __html: this.props.css.content }}
          />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@Herschel_R" />
          <meta name="twitter:title" content="ek|photos" />
          <link
            rel="shortcut icon"
            href="/static/favixon.ico"
            type="image/x-icon"
          />
          <meta name="theme-color" content="#222222" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
