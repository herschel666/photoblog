import * as React from 'react';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Container from '../../container/container';
import Text from '../../components/text/text';
import SetList from '../../components/set-list/set-list';
import styles from './index-styles';

const IndexPage: React.SFC<phox.FrontpageApiData> = ({ content, albums }) => (
  <Container className={css(styles.main)} home={true}>
    <Text className={css(styles.intro)} content={content.body} />
    <SetList albums={albums} />
  </Container>
);

export default IndexPage;
