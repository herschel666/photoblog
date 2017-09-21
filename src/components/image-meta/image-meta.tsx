import * as React from 'react';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import styles from './image-meta-styles';

interface Props {
  meta: phox.PhotoMeta;
  className?: string;
}

const getNiceExposureTime = (exposureTime: number): string => {
  if (exposureTime > 1) {
    return String(exposureTime);
  }
  return `1/${Math.round(1 / exposureTime)}`;
};

const ImageMeta: React.SFC<Props> = ({ meta, className }) => (
  <div className={className}>
    <p className={css(styles.hardware)}>
      {meta.camera}, {meta.lens}
    </p>
    <dl className={css(styles.list)}>
      <dt className={css(styles.type)}>Aperture</dt>
      <dd className={css(styles.definition, styles.aperture)}>
        {meta.aperture}
      </dd>

      <dt className={css(styles.type)}>Focal length</dt>
      <dd className={css(styles.definition)}>{meta.focalLength} mm</dd>

      <dt className={css(styles.type)}>Exposure time</dt>
      <dd className={css(styles.definition)}>
        {getNiceExposureTime(meta.exposureTime)}
      </dd>

      <dt className={css(styles.type)}>ISO</dt>
      <dd className={css(styles.definition)}>{meta.iso}</dd>

      <dt className={css(styles.type)}>Flash fired</dt>
      <dd className={css(styles.definition)}>{meta.flash ? 'Yes' : 'No'}</dd>
    </dl>
  </div>
);

export default ImageMeta;
