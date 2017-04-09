
import React, { PropTypes } from 'react';
import { sortBy, prop } from 'ramda';
import styles from './set-list.sass';

const sortByPublished = sortBy(prop('published'));

const getAlbumItem = ({ title, path }) => (
    <li key={path} className={styles.item}>
        <a href={path}>{title}</a>
    </li>
);

const SetList = ({ list }) => (
    <ul className={styles.list}>
        {sortByPublished(list).reverse().map(getAlbumItem)}
    </ul>
);

SetList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        published: PropTypes.number.isRequired,
        path: PropTypes.string.isRequired,
    })),
};

export default SetList;
