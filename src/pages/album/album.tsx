import * as React from 'react';
import * as qs from 'qs';
import phox from 'phox/typings';
import { withRouter, WithRouterProps } from 'next/router';
import { css } from 'aphrodite/no-important';
import HtmlHead from '../../components/html-head/html-head';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import Text from '../../components/text/text';
import Time from '../../components/time/time';
import Gallery from '../../components/gallery/gallery';
import Comments from '../../components/comments/comments';
import styles from './album-styles';

interface Query {
  album: string;
}
export type AlbumPageProps = phox.AlbumApiData & WithRouterProps<Query>;

const AlbumPage: React.SFC<AlbumPageProps> = ({ content, images, router }) => {
  const { query = { album: '<unknown>' }, pathname = '' } = router || {};

  return (
    <Analytics page={`/sets/${query.album}/`}>
      <Container>
        <HtmlHead>
          <title>{`${content.meta.title} · ek|photos`}</title>
          <meta name="twitter:description" content={content.meta.title} />
        </HtmlHead>
        <h1 className={css(styles.heading)}>{content.meta.title}</h1>
        <Time
          date={new Date(content.meta.published)}
          className={css(styles.pubdate)}
        />
        <Text className={css(styles.description)} content={content.body} />
        <Gallery images={images} />
        <Comments url={`${pathname}?${qs.stringify(query || {})}`} />
      </Container>
    </Analytics>
  );
};

export default withRouter(AlbumPage);
