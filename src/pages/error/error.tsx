import * as React from 'react';
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
        <BackButton destination={{ href: '/' }} />
        <h1 className={css(styles.heading)}>Nothing found</h1>
        <Text content="Sorry, the page you requested apparently doesn't exist. 🦊" />
      </Container>
    </Analytics>
  );
};

export default ErrorPage;
