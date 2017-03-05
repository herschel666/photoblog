
import React, { PropTypes } from 'react';
import Image from '../image/image';

const createImage = ({ file, meta }) => (
    <Image key={file} photo={{ file, meta }} />
);

const Gallery = ({ photos }) => (
    <div>
        {photos.map(createImage)}
    </div>
);

Gallery.propTypes = {
    photos: PropTypes.arrayOf(Image.propTypes.photo).isRequired,
};

export default Gallery;
