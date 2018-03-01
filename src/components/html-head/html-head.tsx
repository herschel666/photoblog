import * as React from 'react';
import Head from 'next/head';
import { getCdnUrl } from '../../util';

const HtmlHead: React.SFC<{}> = ({ children }) => (
  <Head>
    <link rel="preconnect" href={getCdnUrl()} />
    {children}
  </Head>
);

export default HtmlHead;
