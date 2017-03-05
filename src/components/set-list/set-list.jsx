
import React, { PropTypes } from 'react';
import styles from './set-list.sass';

const getAlbumItem = ({ title, path }) => (
    <li key={path} className={styles.item}>
        <a href={path}>{title}</a>
    </li>
);

const SetList = ({ list }) => (
    <ul className={styles.list}>
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
