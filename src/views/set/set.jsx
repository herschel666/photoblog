
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';
import Gallery from '../../components/gallery/gallery';
import styles from './set.sass';

const Set = ({ title, content, photos }) => (
    <Container>
        <h1 className={styles.heading}>{title}</h1>
        <Text className={styles.description} content={content} />
        <Gallery photos={photos} />
    </Container>
);

Set.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    photos: Gallery.propTypes.photos,
};

export default Set;
