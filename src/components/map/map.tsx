import * as React from 'react';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import * as classnames from 'classnames';
import styles from './map-styles';

interface MapInterface {
  coords: phox.LatLng;
  className?: string;
}

const Map: React.SFC<MapInterface> = ({ coords, className }) => {
  const noCoords = !coords.lat || !coords.lng;
  const mapClassName = classnames(
    css(styles.wrap, noCoords && styles.empty),
    className
  );
  return (
    <div className={mapClassName}>
      {!noCoords && (
        <div className={css(styles.inner)}>
          <div
            className={css(styles.map)}
            data-lat={coords.lat}
            data-lng={coords.lng}
          />
        </div>
      )}
    </div>
  );
};

export default Map;
