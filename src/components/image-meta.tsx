import * as React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import styles from './image-meta.module.css';

export interface Exif {
  latitude: number | null;
  longitude: number | null;
  camera: string | null;
  lens: string | null;
  iso: number | null;
  aperture: number | null;
  focalLength: number | null;
  exposureTime: number | null;
  flash: string | boolean | null;
}

interface Props {
  exif?: Exif;
  className?: string;
}

const getNiceExposureTime = (exposureTime: number | null): string => {
  if (exposureTime === null) {
    return '';
  }

  if (exposureTime > 1) {
    return String(exposureTime);
  }

  return `1/${Math.round(1 / exposureTime)}`;
};

const getFlashValue = (flash: Exif['flash']): string | null | never => {
  switch (true) {
    case typeof flash === 'boolean':
      return flash ? 'Yes' : 'No';
    case typeof flash === 'string':
    case flash === null:
      return flash as string | null;
    default:
      throw new Error(`Unexpected value "${flash}".`);
  }
};

const ImageMeta: React.SFC<Props> = ({ exif, className }) => {
  if (exif) {
    const flash = getFlashValue(exif.flash);

    return (
      <div className={className}>
        {Boolean(exif.camera && exif.lens) && (
          <p className={styles.hardware}>
            <Icon icon={faCamera} className={styles.icon} />
            {exif.camera}, {exif.lens}
          </p>
        )}
        <dl className={styles.list}>
          {Boolean(exif.aperture) && (
            <>
              <dt className={styles.type}>Aperture</dt>
              <dd className={classNames(styles.definition, styles.aperture)}>
                {exif.aperture}
              </dd>
            </>
          )}

          {Boolean(exif.focalLength) && (
            <>
              <dt className={styles.type}>Focal length</dt>
              <dd className={styles.definition}>{exif.focalLength} mm</dd>
            </>
          )}

          {Boolean(exif.exposureTime) && (
            <>
              <dt className={styles.type}>Exposure time</dt>
              <dd className={styles.definition}>
                {getNiceExposureTime(exif.exposureTime)}
              </dd>
            </>
          )}

          {Boolean(exif.iso) && (
            <>
              <dt className={styles.type}>ISO</dt>
              <dd className={styles.definition}>{exif.iso}</dd>
            </>
          )}

          {Boolean(flash) && (
            <>
              <dt className={styles.type}>Flash fired</dt>
              <dd className={styles.definition}>{flash}</dd>
            </>
          )}
        </dl>
      </div>
    );
  }
  return null;
};

export default ImageMeta;
