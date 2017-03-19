
import React, { PropTypes } from 'react';
import styles from './back-button.sass';

const BackButton = ({ destination }) => (
    <div className={styles.wrap}>
        <a
            href={destination}
            className={styles.button}
        >back</a>
    </div>
);

BackButton.propTypes = {
    destination: PropTypes.string.isRequired,
};

export default BackButton;
