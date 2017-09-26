import * as React from 'react';
import Head from 'next/head';
import { css } from 'aphrodite/no-important';
import { windowIsDefined } from '../../util';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import BackButton from '../../components/back-button/back-button';
import Text from '../../components/text/text';
import styles from './error-styles';

const ErrorPage: React.SFC<{}> = () => {
  const page = windowIsDefined() ? location.pathname : '_';
  return (
    <Analytics page={page}>
      <Container>
        <Head>
          <title>Nothing found · ek|photos</title>
          <meta name="twitter:description" content="Nothing found" />
        </Head>
        <BackButton destination={{ href: '/' }} />
        <h1 className={css(styles.heading)}>Nothing found</h1>
        <Text content="Sorry, the page you requested apparently doesn't exist. 🦊" />
      </Container>
    </Analytics>
  );
};

export default ErrorPage;
