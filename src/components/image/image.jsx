
import React, { PropTypes } from 'react';
import { format } from 'date-fns';

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
        <figure>
            {createImg(file, isDetail)}
            <figcaption>
                <time dateTime={format(meta.createdAt, 'YYYY-MM-DD')}>
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
