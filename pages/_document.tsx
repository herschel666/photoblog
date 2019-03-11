import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Document, {
  Head,
  Main,
  NextScript,
  NextDocumentContext,
  Enhancer,
} from 'next/document';
import { StyleSheetServer } from 'aphrodite/no-important';

// tslint:disable-next-line
const stylesheet = require('styles/global.css');

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: NextDocumentContext) {
    let html;
    let styles;
    const originalRenderPage = ctx.renderPage;
    const enhanceApp: Enhancer = (App) => (props: any) => {
      const app = <App {...props} />;
      const result = StyleSheetServer.renderStatic(() =>
        ReactDOMServer.renderToString(app)
      );
      html = result.html;
      styles = <style data-aphrodite={true}>{result.css.content}</style>;

      return app;
    };

    ctx.renderPage = () => originalRenderPage({ enhanceApp });

    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, html, styles };
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
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@Herschel_R" />
          <meta name="twitter:title" content="ek|photos" />
          <link
            rel="shortcut icon"
            href="/static/favicon.ico"
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
