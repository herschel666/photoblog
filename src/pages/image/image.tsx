import * as React from 'react';
import phox from 'phox/typings';
import { css } from 'aphrodite/no-important';
import Link from 'next/link';
import Container from '../../container/container';
import BackButton from '../../components/back-button/back-button';
import Image from '../../components/image/image';
import ImageMeta from '../../components/image-meta/image-meta';
import Comments from '../../components/comments/comments';
import Map from '../../components/map/map';
import styles from './image-styles';

const Photo: React.SFC<phox.ImageApiData> = ({ image, prev, next, back }) => {
  const { title, gps } = image.meta;
  return (
    <Container>
      <h1 className={css(styles.heading)}>{title}</h1>
      <BackButton destination={back.linkProps} />
      <Image image={image} detail={true} />
      <div className={css(styles.nav)}>
        {Boolean(prev) && (
          <Link {...prev.linkProps}>
            <a>{prev.title}</a>
          </Link>
        )}
        {Boolean(next) && (
          <Link {...next.linkProps}>
            <a>{next.title}</a>
          </Link>
        )}
      </div>
      <div className={css(styles.metaWrap)}>
        <ImageMeta
          meta={image.meta}
          className={css(styles.meta, styles.camera)}
        />
        <Map coords={gps} className={css(styles.meta, styles.map)} />
      </div>
      <Comments />
    </Container>
  );
};

export default Photo;
