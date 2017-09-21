import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { StyleSheetServer } from 'aphrodite';

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
          <title>My page</title>
          <style
            data-aphrodite
            dangerouslySetInnerHTML={{ __html: this.props.css.content }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
