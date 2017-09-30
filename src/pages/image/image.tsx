import * as React from 'react';
import * as qs from 'qs';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Link from 'next/link';
import Head from 'next/head';
import Container from '../../container/container';
import Analytics from '../../components/analytics/analytics';
import BackButton from '../../components/back-button/back-button';
import Photo from '../../components/photo/photo';
import ImageMeta from '../../components/image-meta/image-meta';
import Comments from '../../components/comments/comments';
import Map from '../../components/map/map';
import styles from './image-styles';

interface ImagePageInterface {
  url: UrlObject;
}

export type ImagePageProps = phox.ImageApiData & ImagePageInterface;

const ImagePage: React.SFC<ImagePageProps> = ({
  image,
  prev,
  next,
  back,
  url,
}) => {
  const { title, gps } = image.meta;
  return (
    <Analytics page={`/sets/${url.query.album}/${url.query.image}/`}>
      <Container>
        <Head>
          <title>{`🖼 '${title}' · ek|photos`}</title>
          <meta name="twitter:description" content={title} />
        </Head>
        <h1 className={css(styles.heading)}>{title}</h1>
        <BackButton destination={back.linkProps} />
        <Photo image={image} detail={true} />
        <div className={css(styles.nav)}>
          {Boolean(prev) ? (
            <Link {...prev.linkProps}>
              <a className={css(styles.prev)}>{prev.title}</a>
            </Link>
          ) : (
            <span className={css(styles.prev, styles.hidden)} />
          )}
          {Boolean(next) ? (
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
        <Comments url={`${url.pathname}?${qs.stringify(url.query || {})}`} />
      </Container>
    </Analytics>
  );
};

export default ImagePage;
