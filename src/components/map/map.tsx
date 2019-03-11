import * as React from 'react';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import * as classnames from 'classnames';
import styles from './map-styles';
import { isDevEnv } from '../../util';

interface MapInterface {
  coords: phox.LatLng;
  className?: string;
}

interface MapStateInterface {
  zoom: number;
}

const FALLBACK_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAf' +
  'FcSJAAAADUlEQVR42mNcd+P/fwAIRwOGEN0VpwAAAABJRU5ErkJggg==';

export default class Map extends React.Component<
  MapInterface,
  MapStateInterface
> {
  constructor(props: MapInterface) {
    super(props);
    this.state = {
      zoom: 16,
    };
  }

  private readonly getImageMapUrl = (): string => {
    if (isDevEnv()) {
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
    const mapClassName = classnames(
      css(styles.wrap, !hasCoords && styles.empty),
      this.props.className
    );
    return (
      <div className={mapClassName}>
        {hasCoords && (
          <a
            className={css(styles.inner)}
            href={this.getExternalMapUrl()}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              className={css(styles.map)}
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
