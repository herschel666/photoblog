
import React, { PropTypes } from 'react';
import slug from 'slug';
import classnames from 'classnames';
import { format } from 'date-fns';
import styles from './image.sass';

const getDetailLink = (title, src) => {
    const [, imageId = '1'] = /^\/([^.]+)\.jpg$/i.exec(src);
    return `/photo/${slug(title.toLowerCase())}-${imageId}/`;
};

const getSizesMap = () => [300, 600, 900].map(i =>
    `(max-width: ${i}px) ${i}px`).concat(['1200px']).join(',');

const createImg = (src, srcSet, title, isDetail) => {
    const img = <img
        src={src}
        srcSet={srcSet}
        sizes={getSizesMap()}
        alt=""
    />;
    if (isDetail) {
        return img;
    }
    return (
        <a href={getDetailLink(title, src)}>
            {img}
        </a>
    );
};

const Image = ({ photo, detail }) => {
    const { srcSet, src, meta } = photo;
    const isDetail = Boolean(detail);
    return (
        <figure className={styles.figure}>
            {createImg(src, srcSet, meta.title, isDetail)}
            <figcaption>
                <time
                    className={classnames(styles.time, {
                        [styles.galleryTime]: !isDetail,
                    })}
                    dateTime={format(meta.createdAt, 'YYYY-MM-DD')}>
                    {format(meta.createdAt, 'YYYY/MM/DD')}
                </time>
                {isDetail ? null : meta.title}
            </figcaption>
        </figure>
    );
};

Image.propTypes = {
    photo: PropTypes.shape({
        srcSet: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
        meta: PropTypes.shape({
            title: PropTypes.string.isRequired,
            createdAt: PropTypes.instanceOf(Date).isRequired,
        }).isRequired,
    }).isRequired,
    detail: PropTypes.bool,
};

export default Image;
