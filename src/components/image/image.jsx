
import React, { PropTypes } from 'react';
import slug from 'slug';
import classnames from 'classnames';
import Time from '../time/time';
import { imageMetaShape } from '../image-meta/image-meta';
import styles from './image.sass';

const getDetailLink = (title, image) =>
    `/photo/${slug(title.toLowerCase())}-${image}/`;

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
            style={{ background: `rgba(${color.join(',')})` }}
            className={styles.image}
            alt={meta.title}
        />
        <noscript>
            <img
                src={src}
                srcSet={srcSet}
                alt={meta.title}
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

const createTime = (id, createdAt, needsDash) => {
    const elem = <Time date={createdAt} className={classnames(styles.time, {
        [styles.needsDash]: needsDash,
    })} />;
    if (id) {
        return (<a href={`#${id}`} className={styles.hashLink}>
            {elem}
        </a>);
    }
    return elem;
}

const Image = ({ photo, detail, id = null }) => {
    const { meta, placeholder } = photo;
    const isDetail = Boolean(detail);
    const hasDescription = Boolean(meta.description);
    const figureStyles = { maxWidth: `calc(96vh / ${placeholder.ratio})` };
    const description = <span dangerouslySetInnerHTML={{ __html: meta.description }} />;
    return (
        <figure
            className={classnames(styles.figure, 'js-image')}
            style={figureStyles}
            id={id}
        >
            {createImg(photo, isDetail)}
            <figcaption className={classnames(styles.figcaption, {
                [styles.detailFigcaption]: isDetail,
            })}>
                {createTime(id, meta.createdAt, hasDescription || !isDetail)}
                {isDetail ? description : meta.title}
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
    id: PropTypes.string,
};

export default Image;
