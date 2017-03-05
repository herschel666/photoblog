
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Image from '../../components/image/image';

const Photo = ({ photo }) => {
    const { meta, file } = photo;
    return (
        <Container>
            <h1>{meta.title}</h1>
            <Image photo={{ file, meta }} detail />
        </Container>
    );
};

Photo.propTypes = {
    photo: Image.propTypes.photo,
};

export default Photo;
