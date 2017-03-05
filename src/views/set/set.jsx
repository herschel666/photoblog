
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';
import Gallery from '../../components/gallery/gallery';

const Set = ({ title, content, photos }) => (
    <Container>
        <h1>{title}</h1>
        <hr />
        <Text content={content} />
        <Gallery photos={photos} />
    </Container>
);

Set.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    photos: Gallery.propTypes.photos,
};

export default Set;
