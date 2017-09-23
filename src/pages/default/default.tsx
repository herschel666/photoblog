import * as React from 'react';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Container from '../../container/container';
import BackButton from '../../components/back-button/back-button';
import Text from '../../components/text/text';
import styles from './default-styles';

const DefaultPage: React.SFC<phox.PageApiData> = ({ meta, body }) => (
  <Container>
    <BackButton destination={{ href: '/' }} />
    <h1 className={css(styles.heading)}>{meta.title}</h1>
    <Text content={body} />
  </Container>
);

export default DefaultPage;
