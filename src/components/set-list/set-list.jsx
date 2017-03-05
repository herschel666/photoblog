
import React, { PropTypes } from 'react';

const getAlbumItem = ({ title, path }) => (
    <li key={path}>
        <a href={path}>{title}</a>
    </li>
);

const SetList = ({ list }) => (
    <ul>
        {list.map(getAlbumItem)}
    </ul>
);

SetList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
    })),
};

export default SetList;
