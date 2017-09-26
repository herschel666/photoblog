import * as React from 'react';
import * as qs from 'qs';
import Head from 'next/head';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import Text from '../../components/text/text';
import Time from '../../components/time/time';
import Gallery from '../../components/gallery/gallery';
import Comments from '../../components/comments/comments';
import styles from './album-styles';

interface AlbumPageInterface {
  url: UrlObject;
}

export type AlbumPageProps = phox.AlbumApiData & AlbumPageInterface;

const AlbumPage: React.SFC<AlbumPageProps> = ({ content, images, url }) => (
  <Analytics page={`/sets/${url.query.album}/`}>
    <Container>
      <Head>
        <title>{`${content.meta.title} · ek|photos`}</title>
        <meta name="twitter:description" content={content.meta.title} />
      </Head>
      <h1 className={css(styles.heading)}>{content.meta.title}</h1>
      <Time
        date={new Date(content.meta.published)}
        className={css(styles.pubdate)}
      />
      <Text className={css(styles.description)} content={content.body} />
      <Gallery images={images} />
      <Comments url={`${url.pathname}?${qs.stringify(url.query || {})}`} />
    </Container>
  </Analytics>
);

export default AlbumPage;
