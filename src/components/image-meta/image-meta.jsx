
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './image-meta.sass';

const orientations = ['landscape', 'portrait', 'square'];

const getNiceExposureTime = (exposureTime) => {
    if (exposureTime > 1) {
        return exposureTime;
    }
    return `1/${Math.round(1/exposureTime)}`;
};

const ImageMeta = ({
    camera,
    lens,
    iso,
    aperture,
    focalLength,
    exposureTime,
    flash,
    className = '',
}) => (
    <div className={className}>
        <p className={styles.hardware}>{camera}, {lens}</p>
        <dl className={styles.list}>

            <dt className={styles.type}>Aperture</dt>
            <dd className={classnames(
                styles.definition, styles.aperture)}
            >{aperture}</dd>

            <dt className={styles.type}>Focal length</dt>
            <dd className={styles.definition}>{focalLength} mm</dd>

            <dt className={styles.type}>Exposure time</dt>
            <dd className={styles.definition}>
                {getNiceExposureTime(exposureTime)}
            </dd>

            <dt className={styles.type}>ISO</dt>
            <dd className={styles.definition}>{iso}</dd>

            <dt className={styles.type}>Flash fired</dt>
            <dd className={styles.definition}>{flash ? 'Yes' : 'No'}</dd>
        </dl>
    </div>
);

export const imageMetaShape = ImageMeta.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    camera: PropTypes.string.isRequired,
    lens: PropTypes.string.isRequired,
    iso: PropTypes.number.isRequired,
    aperture: PropTypes.string.isRequired,
    focalLength: PropTypes.string.isRequired,
    exposureTime: PropTypes.number.isRequired,
    flash: PropTypes.bool.isRequired,
    gps: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }).isRequired,
    orientation: PropTypes.oneOf(orientations).isRequired,
    className: PropTypes.string,
};

export default ImageMeta;
