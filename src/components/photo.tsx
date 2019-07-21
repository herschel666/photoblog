import React from 'react';
import classNames from 'classnames';
import { Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';

import styles from './photo.module.css';

interface Props {
  isDetail?: boolean;
  slug: string;
  src: FluidObject & { width: number };
  title: string;
  description?: string;
  date: string;
  relativeDate: string;
}

const OptionalLink: React.SFC<Pick<Props, 'slug' | 'isDetail'>> = ({
  slug,
  isDetail,
  children,
}) => {
  if (Boolean(isDetail)) {
    return <>{children}</>;
  }
  return <Link to={slug}>{children}</Link>;
};

const getImageStyles = (
  aspectRatio: FluidObject['aspectRatio'],
  width: number
): React.CSSProperties => {
  if (aspectRatio >= 1) {
    return {};
  }
  return {
    maxWidth: `${aspectRatio * width}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
  };
};

const Photo: React.SFC<Props> = ({
  isDetail,
  slug,
  src,
  title,
  description = '',
  date,
  relativeDate,
}) => {
  const detail = Boolean(isDetail);
  const hasDescription = Boolean(description);
  const needsDash = hasDescription || !detail;

  return (
    <figure className={styles.figure}>
      <OptionalLink slug={slug} isDetail={isDetail}>
        <Img
          fluid={src}
          alt={title}
          style={getImageStyles(src.aspectRatio, src.width)}
        />
      </OptionalLink>
      <figcaption
        className={classNames(styles.figcaption, {
          [styles.detailFigcaption]: detail,
        })}
      >
        <time
          dateTime={date}
          className={classNames(styles.time, {
            [styles.needsDash]: needsDash,
          })}
        >
          {relativeDate}
        </time>
        {detail ? (
          <span dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <span>{title}</span>
        )}
      </figcaption>
    </figure>
  );
};
export default Photo;
