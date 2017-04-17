
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './map.sass';

const Map = ({ lat = '', lng = '', className = '' }) => {
    const noCoords = !lat || !lng;
    const mapClassName = classnames(styles.wrap, className, {
        [styles.empty]: noCoords,
    });
    return (
        <div className={mapClassName}>
            {!noCoords && (<div className={styles.inner}>
                <div
                    className={styles.map}
                    data-lat={lat}
                    data-lng={lng}
                    id="photo-map"
                />
            </div>)}
        </div>
    );
};

Map.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
    className: PropTypes.string,
};

export default Map;
