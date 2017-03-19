
import React, { PropTypes } from 'react';
import Image from '../image/image';

const createImage = photo => (
    <Image key={photo.src} photo={photo} />
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
