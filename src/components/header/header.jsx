
import React, { PropTypes } from 'react';
import styles from './header.sass';

const title = 'ek|photos';

const Header = ({ home }) => (
    <header className={styles.header}>
        <span className={styles.title}>
            {home
                ? title
                : <a href="/" className={styles.link}>{title}</a>}
        </span>
    </header>
);

Header.propTypes = {
    home: PropTypes.bool.isRequired,
};

export default Header;
