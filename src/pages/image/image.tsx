import * as React from 'react';
import * as qs from 'qs';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Link from 'next/link';
import { withRouter, WithRouterProps } from 'next/router';
import HtmlHead from '../../components/html-head/html-head';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import BackButton from '../../components/back-button/back-button';
import Photo from '../../components/photo/photo';
import ImageMeta from '../../components/image-meta/image-meta';
import Comments from '../../components/comments/comments';
import Map from '../../components/map/map';
import styles from './image-styles';

interface Query {
  album: string;
  image: string;
}
export type ImagePageProps = phox.ImageApiData & WithRouterProps<Query>;

const ImagePage: React.SFC<ImagePageProps> = ({
  image,
  prev,
  next,
  back,
  router,
}) => {
  const fallbackQuery = { album: '', image: '' };
  const { query = fallbackQuery, pathname = '' } = router || {};

  const { title = '', gps = {} } = image.meta || {};
  return (
    <Analytics page={`/sets/${query.album}/${query.image}/`}>
      <Container>
        <HtmlHead>
          <title>{`🖼 '${title}' · ek|photos`}</title>
          <meta name="twitter:description" content={title} />
        </HtmlHead>
        <h1 className={css(styles.heading)}>{title}</h1>
        <BackButton destination={back.linkProps} />
        <Photo image={image} detail={true} />
        <div className={css(styles.nav)}>
          {prev ? (
            <Link {...prev.linkProps}>
              <a className={css(styles.prev)}>{prev.title}</a>
            </Link>
          ) : (
            <span className={css(styles.prev, styles.hidden)} />
          )}
          {next ? (
            <Link {...next.linkProps}>
              <a className={css(styles.next)}>{next.title}</a>
            </Link>
          ) : (
            <span className={css(styles.next, styles.hidden)} />
          )}
        </div>
        <div className={css(styles.metaWrap)}>
          <ImageMeta
            meta={image.meta}
            className={css(styles.meta, styles.camera)}
          />
          <Map coords={gps} className={css(styles.meta, styles.map)} />
        </div>
        <Comments url={`${pathname}?${qs.stringify(query || {})}`} />
      </Container>
    </Analytics>
  );
};

export default withRouter(ImagePage);
