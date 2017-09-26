import * as React from 'react';
import Head from 'next/head';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import BackButton from '../../components/back-button/back-button';
import Text from '../../components/text/text';
import styles from './default-styles';

interface DefaultPageInterface {
  url: UrlObject;
}

export type DefaultPageProps = phox.PageApiData & DefaultPageInterface;

const DefaultPage: React.SFC<DefaultPageProps> = ({ meta, body, url }) => (
  <Analytics page={`/${url.query.page}/`}>
    <Container>
      <Head>
        <title>{`${meta.title} · ek|photos`}</title>
        <meta name="twitter:description" content={meta.title} />
      </Head>
      <BackButton destination={{ href: '/' }} />
      <h1 className={css(styles.heading)}>{meta.title}</h1>
      <Text content={body} />
    </Container>
  </Analytics>
);

export default DefaultPage;
