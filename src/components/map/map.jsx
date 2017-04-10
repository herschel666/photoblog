
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './map.sass';

const Map = ({ lat = '', lng = '', className = '' }) => {
    const mapClassName = classnames(styles.wrap, className);
    return (
        <div className={mapClassName} data-lat={lat} data-lng={lng}>
            <div className={styles.inner}>
                <div className={styles.map}>
                    <span className={styles.caption}>No data</span>
                </div>
            </div>
        </div>
    );
};

Map.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
    className: PropTypes.string,
};

export default Map;
