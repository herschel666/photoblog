import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './map.module.css';

interface Props {
  coords: {
    lat: number | null;
    lng: number | null;
  };
  className?: string;
}

interface State {
  zoom: number;
}

const OSM_URL = 'https://www.openstreetmap.org';

export default class Map extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      zoom: 16,
    };
  }

  private readonly getImageMapUrl = (): string => {
    const lat = this.props.coords.lat || 0;
    const lng = this.props.coords.lng || 0;
    const bBox = `${lng - 0.0015},${lat - 0.0005},${lng + 0.0015},${
      lat + 0.0005
    }`;
    const mapUrl = new URL(OSM_URL);
    mapUrl.pathname = '/export/embed.html';
    mapUrl.searchParams.append('bbox', bBox);
    mapUrl.searchParams.append('layer', 'mapnik');
    mapUrl.searchParams.append('marker', `${lat},${lng}`);
    return mapUrl.toString();
  };

  private readonly getExternalMapUrl = (): string => {
    const lat = this.props.coords.lat || 0;
    const lng = this.props.coords.lng || 0;
    const mapUrl = new URL(OSM_URL);
    mapUrl.hash = `map=19/${lat}/${lng}`;
    mapUrl.searchParams.append('mlat', String(lat));
    mapUrl.searchParams.append('mlon', String(lng));
    return mapUrl.toString();
  };

  public render() {
    const hasCoords = this.props.coords.lat && this.props.coords.lng;
    const mapClassName = classNames(styles.wrap, this.props.className, {
      [styles.empty]: !hasCoords,
    });
    return (
      <div className={mapClassName}>
        {hasCoords && (
          <>
            <div className={styles.inner}>
              <iframe
                className={styles.map}
                width="480"
                height="240"
                referrerPolicy="no-referrer"
                data-testid="osm-iframe"
                src={this.getImageMapUrl()}
              ></iframe>
            </div>
            <a
              href={this.getExternalMapUrl()}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="osm-link"
            >
              View on openstreetmap.org
              <Icon
                icon={faExternalLinkAlt}
                className={styles.linkIcon}
                aria-hidden="true"
              />
            </a>
          </>
        )}
      </div>
    );
  }
}
