
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Image from '../../components/image/image';
import styles from './photo.sass';

const Photo = ({ photo }) => {
    const { title } = photo.meta;
    return (
        <Container>
            <h1 className={styles.heading}>{title}</h1>
            <Image photo={photo} detail />
        </Container>
    );
};

Photo.propTypes = {
    photo: Image.propTypes.photo,
};

export default Photo;
