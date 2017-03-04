
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';
import Gallery from '../../components/gallery/gallery';

const Album = ({ title, content, photos }) => (
    <Container>
        <h1>{title}</h1>
        <hr />
        <Text content={content} />
        <Gallery photos={photos} />
    </Container>
);

Album.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(PropTypes.shape({
        file: PropTypes.string.isRequired,
    })),
};

export default Album;
