import * as React from 'react';
import Link from 'next/link';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import Time from '../time/time';
import styles from './image-styles';

interface ImageInterface {
  image: phox.Image;
  detail?: boolean;
  load?: boolean;
}

const createImg = (
  { filePath, detailLinkProps, meta }: phox.Image,
  ratio: number,
  isDetail: boolean,
  load: boolean
): JSX.Element => {
  const imgSrc = load ? `/${filePath}` : '/static/default.jpg';
  const imgClassName = css(styles.image, !load && styles.placeholder);
  const img = (
    <span
      className={css(styles.imageWrap)}
      style={{ paddingTop: `${ratio * 100}%` }}
    >
      <img src={imgSrc} className={imgClassName} alt={meta.title} />
    </span>
  );
  if (isDetail) {
    return img;
  }
  return (
    <Link {...detailLinkProps}>
      <a>{img}</a>
    </Link>
  );
};

const Image: React.SFC<ImageInterface> = ({ image, detail, load }) => {
  const { meta } = image;
  const isDetail = Boolean(detail);
  const hasDescription = Boolean(meta.description);
  const needsDash = hasDescription || !isDetail;
  const ratio = (meta.height / meta.width).toFixed(6);
  const figureStyles = { maxWidth: `calc(96vh / ${ratio})` };
  const description = (
    <span dangerouslySetInnerHTML={{ __html: meta.description }} />
  );
  return (
    <figure className={css(styles.figure)} style={figureStyles}>
      {createImg(image, Number(ratio), isDetail, load)}
      <figcaption
        className={css(styles.figcaption, isDetail && styles.detailFigcaption)}
      >
        <Time
          date={new Date(meta.createdAt)}
          className={css(styles.time, needsDash && styles.needsDash)}
        />
        {isDetail ? description : meta.title}
      </figcaption>
    </figure>
  );
};

Image.defaultProps = {
  load: true,
};

export default Image;
