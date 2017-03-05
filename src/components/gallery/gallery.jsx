
import React, { PropTypes } from 'react';

const getDetailLinkFromFileName = file =>
    `/photo${file.replace('.jpg', '')}/`;

const createImage = ({ file }) => (
    <figure key={file}>
        <a href={getDetailLinkFromFileName(file)}>
            <img src={file} alt="" />
        </a>
    </figure>
);

const Gallery = ({ photos }) => (
    <div>
        {photos.map(createImage)}
    </div>
);

Gallery.propTypes = {
    photos: PropTypes.arrayOf(PropTypes.shape({
        file: PropTypes.string.isRequired,
    })),
};

export default Gallery;
