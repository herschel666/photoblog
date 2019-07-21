import * as React from 'react';
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
  flash: boolean;
}

interface Props {
  exif?: Exif;
  className?: string;
}

const getNiceExposureTime = (exposureTime: number): string => {
  if (exposureTime > 1) {
    return String(exposureTime);
  }
  return `1/${Math.round(1 / exposureTime)}`;
};

const ImageMeta: React.SFC<Props> = ({ exif, className }) => {
  if (exif) {
    return (
      <div className={className}>
        {Boolean(exif.camera && exif.lens) && (
          <p className={styles.hardware}>
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

          <dt className={styles.type}>Flash fired</dt>
          <dd className={styles.definition}>{exif.flash ? 'Yes' : 'No'}</dd>
        </dl>
      </div>
    );
  }
  return null;
};

export default ImageMeta;
