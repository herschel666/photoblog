
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './back-button.sass';

const BackButton = ({ destination, detail }) => (
    <div className={styles.wrap}>
        <a
            href={destination}
            className={classnames(styles.button, {
                'js-back-to-set': detail,
            })}
        >back</a>
    </div>
);

BackButton.propTypes = {
    destination: PropTypes.string.isRequired,
    detail: PropTypes.bool,
};

export default BackButton;
