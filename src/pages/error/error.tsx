import * as React from 'react';
import { css } from 'aphrodite/no-important';
import Container from '../../container/container';
import BackButton from '../../components/back-button/back-button';
import Text from '../../components/text/text';
import styles from './error-styles';

const ErrorPage: React.SFC<{}> = () => (
  <Container>
    <BackButton destination={{ href: '/' }} />
    <h1 className={css(styles.heading)}>Nothing found</h1>
    <Text content="Sorry, the page you requested apparently doesn't exist. 🦊" />
  </Container>
);

export default ErrorPage;
