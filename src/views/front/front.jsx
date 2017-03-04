
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';

const getAlbumItem = ({ title, path }) => (
    <li key={path}>
        <a href={path}>{title}</a>
    </li>
);

const Front = ({ content, photo, list }) => (
    <Container home>
        <Text content={content} />
        <img src={photo.file} />
        <ul>
            {list.map(getAlbumItem)}
        </ul>
    </Container>
);

Front.propTypes = {
    content: PropTypes.string.isRequired,
    photo: PropTypes.shape({
        file: PropTypes.string.isRequired,
    }),
    list: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
    })),
};

export default Front;
