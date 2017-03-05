
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { format } from 'date-fns';
import styles from './image.sass';

const getDetailLinkFromFileName = file =>
    `/photo${file.replace('.jpg', '')}/`;

const createImg = (file, isDetail) => {
    const img = <img src={file} alt="" />;
    if (isDetail) {
        return img;
    }
    return (
        <a href={getDetailLinkFromFileName(file)}>
            {img}
        </a>
    );
};

const Image = ({ photo, detail }) => {
    const { file, meta } = photo;
    const isDetail = Boolean(detail);
    return (
        <figure className={styles.figure}>
            {createImg(file, isDetail)}
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
        file: PropTypes.string.isRequired,
        meta: PropTypes.shape({
            title: PropTypes.string.isRequired,
            createdAt: PropTypes.instanceOf(Date),
        }).isRequired,
    }),
    detail: PropTypes.bool,
};

export default Image;
