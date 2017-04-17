
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Container from '../../container/container';
import BackButton from '../../components/back-button/back-button';
import Image from '../../components/image/image';
import ImageMeta from '../../components/image-meta/image-meta';
import Comments from '../../components/comments/comments';
import Map from '../../components/map/map';
import styles from './photo.sass';

const Photo = ({ photo, setPath }) => {
    const { title, gps } = photo.meta;
    return (
        <Container>
            <h1 className={styles.heading}>{title}</h1>
            <BackButton destination={setPath} />
            <Image photo={photo} detail />
            <div className={styles.metaWrap}>
                <ImageMeta
                    {...photo.meta}
                    className={classnames(styles.meta, styles.camera)}
                />
                <Map {...gps} className={classnames(styles.meta, styles.map)} />
            </div>
            <Comments />
        </Container>
    );
};

Photo.propTypes = {
    photo: Image.propTypes.photo,
    setPath: PropTypes.string.isRequired,
};

export default Photo;
