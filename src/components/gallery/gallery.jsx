
import React, { PropTypes } from 'react';
import BackButton from '../back-button/back-button';
import Image from '../image/image';

const createImage = photo => (
    <Image key={photo.src} photo={photo} />
);

const Gallery = ({ photos }) => (
    <div>
        <BackButton destination="/" />
        {photos.map(createImage)}
        <BackButton destination="/" />
    </div>
);

Gallery.propTypes = {
    photos: PropTypes.arrayOf(Image.propTypes.photo).isRequired,
};

export default Gallery;
