import * as React from 'react';
import Head from 'next/head';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import Gallery from '../../components/gallery/gallery';
import styles from './tag-styles';

interface TagPageInterface {
  url: UrlObject;
}

export type TagPageProps = phox.TagApiData & TagPageInterface;

const TagPage: React.SFC<TagPageProps> = ({ images, title, url }) => (
  <Analytics page={`/tag/${url.query.tag}/`}>
    <Container>
      <Head>
        <title>{`${title} · ek|photos`}</title>
        <meta name="twitter:description" content={title} />
      </Head>
      <h1 className={css(styles.heading)}>{title}</h1>
      <Gallery images={images} />
    </Container>
  </Analytics>
);

export default TagPage;
