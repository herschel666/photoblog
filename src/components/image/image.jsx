
import React, { PropTypes } from 'react';
import slug from 'slug';
import classnames from 'classnames';
import Time from '../time/time';
import { imageMetaShape } from '../image-meta/image-meta';
import styles from './image.sass';

const getDetailLink = (title, image) =>
    `/photo/${slug(title.toLowerCase())}-${image}/`;

const getSizesMap = () => [300, 600, 900].map(i =>
    `(max-width: ${i}px) ${i}px`).concat(['1200px']).join(',');

const createImg = ({ src, srcSet, placeholder, meta, image }, isDetail) => {
    const { url, color, ratio } = placeholder;
    const img = (<span
            className={styles.imageWrap}
            style={{ paddingTop: `${ratio * 100}%` }}
        >
        <img
            src={url}
            data-src={src}
            data-src-set={srcSet}
            sizes={getSizesMap()}
            style={{ background: `rgba(${color.join(',')})` }}
            className={styles.image}
            alt=""
        />
        <noscript>
            <img
                src={src}
                srcSet={srcSet}
                alt=""
                className={classnames(styles.image, styles.imageNoJs)}
            />
        </noscript>
    </span>);
    if (isDetail) {
        return img;
    }
    return (
        <a href={getDetailLink(meta.title, image)}>
            {img}
        </a>
    );
};

const Image = ({ photo, detail }) => {
    const { meta } = photo;
    const isDetail = Boolean(detail);
    return (
        <figure className={styles.figure}>
            {createImg(photo, isDetail)}
            <figcaption>
                <Time date={meta.createdAt} className={classnames(styles.time, {
                    [styles.galleryTime]: !isDetail,
                })} />
                {isDetail ? null : meta.title}
            </figcaption>
        </figure>
    );
};

Image.propTypes = {
    photo: PropTypes.shape({
        srcSet: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        placeholder: PropTypes.shape({
            url: PropTypes.string.isRequired,
            color: PropTypes.arrayOf(PropTypes.number).isRequired,
            ratio: PropTypes.number.isRequired,
        }).isRequired,
        meta: PropTypes.shape(imageMetaShape).isRequired,
        image: PropTypes.string,
    }).isRequired,
    detail: PropTypes.bool,
};

export default Image;
