import * as React from 'react';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import HtmlHead from '../../components/html-head/html-head';
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
      <HtmlHead>
        <title>{`${title} · ek|photos`}</title>
        <meta name="twitter:description" content={title} />
      </HtmlHead>
      <h1 className={css(styles.heading)}>{title}</h1>
      <Gallery images={images} />
    </Container>
  </Analytics>
);

export default TagPage;
