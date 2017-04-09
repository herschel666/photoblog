
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import BackButton from '../../components/back-button/back-button';
import Image from '../../components/image/image';
import ImageMeta from '../../components/image-meta/image-meta';
import styles from './photo.sass';

const Photo = ({ photo, setPath }) => {
    const { title } = photo.meta;
    return (
        <Container>
            <h1 className={styles.heading}>{title}</h1>
            <BackButton destination={setPath} />
            <Image photo={photo} detail />
            <ImageMeta {...photo.meta} />
            <div className={styles.comments} id="disqus_thread">
                <button className={styles.button} type="button">
                    Load Disqus comments &hellip;
                </button>
            </div>
        </Container>
    );
};

Photo.propTypes = {
    photo: Image.propTypes.photo,
    setPath: PropTypes.string.isRequired,
};

export default Photo;
