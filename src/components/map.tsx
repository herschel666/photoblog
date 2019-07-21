import React from 'react';
import classNames from 'classnames';

import styles from './map.module.css';

interface Props {
  coords: {
    lat?: number;
    lng?: number;
  };
  className?: string;
}

interface State {
  zoom: number;
}

const FALLBACK_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAf' +
  'FcSJAAAADUlEQVR42mNcd+P/fwAIRwOGEN0VpwAAAABJRU5ErkJggg==';

const isDevEnv = process.env.NODE_ENV !== 'production';

export default class Map extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      zoom: 16,
    };
  }

  private readonly getImageMapUrl = (): string => {
    if (isDevEnv) {
      return FALLBACK_IMG;
    }

    const tupel = `${this.props.coords.lat || 0},${this.props.coords.lng || 0}`;
    return (
      `https://maps.googleapis.com/maps/api/staticmap?center=${tupel}` +
      `&zoom=${this.state.zoom}&size=500x250&maptype=roadmap&` +
      'key=AIzaSyBkHslYtDNjAoBIjzls4G9Ej8wqsXtWlbs' +
      `&markers=color:red%7Clabel:C%7C${tupel}`
    );
  };

  private readonly getExternalMapUrl = (): string =>
    `https://www.google.de/maps/@${this.props.coords.lat || 0},${this.props
      .coords.lng || 0},14z`;

  private readonly toogleZoom = (mouseOver: boolean) => (): void => {
    if (mouseOver) {
      this.setState({ zoom: 12 });
      return;
    }
    this.setState({ zoom: 16 });
  };

  public render() {
    const hasCoords = this.props.coords.lat && this.props.coords.lng;
    const mapClassName = classNames(styles.wrap, this.props.className, {
      [styles.empty]: !hasCoords,
    });
    return (
      <div className={mapClassName}>
        {hasCoords && (
          <a
            className={styles.inner}
            href={this.getExternalMapUrl()}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              className={styles.map}
              src={this.getImageMapUrl()}
              alt="Map showing the photo location"
              onMouseEnter={this.toogleZoom(true)}
              onMouseLeave={this.toogleZoom(false)}
            />
          </a>
        )}
      </div>
    );
  }
}
