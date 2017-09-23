import * as React from 'react';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Container from '../../container/container';
import Text from '../../components/text/text';
import Time from '../../components/time/time';
import Gallery from '../../components/gallery/gallery';
import Comments from '../../components/comments/comments';
import styles from './album-styles';

const AlbumPage: React.SFC<phox.AlbumApiData> = ({ content, images }) => (
  <Container>
    <h1 className={css(styles.heading)}>{content.meta.title}</h1>
    <Time
      date={new Date(content.meta.published)}
      className={css(styles.pubdate)}
    />
    <Text className={css(styles.description)} content={content.body} />
    <Gallery images={images} />
    <Comments />
  </Container>
);

export default AlbumPage;
