import * as React from 'react';
import phox from 'phox/typings';
import { withRouter, WithRouterProps } from 'next/router';
import { css } from 'aphrodite/no-important';
import HtmlHead from '../../components/html-head/html-head';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import Gallery from '../../components/gallery/gallery';
import styles from './tag-styles';

interface Query {
  tag: string;
}
export type TagPageProps = phox.TagApiData & WithRouterProps<Query>;

const TagPage: React.SFC<TagPageProps> = ({ images, title, router }) => {
  const page =
    router && router.query ? `/tag/${router.query.tag}/` : '/tag/<unknown>/';

  return (
    <Analytics page={page}>
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
};

export default withRouter(TagPage);
