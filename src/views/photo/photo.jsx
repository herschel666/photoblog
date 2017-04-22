
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import Container from '../../container/container';
import BackButton from '../../components/back-button/back-button';
import Image from '../../components/image/image';
import ImageMeta from '../../components/image-meta/image-meta';
import Comments from '../../components/comments/comments';
import Map from '../../components/map/map';
import styles from './photo.sass';

const NavLink = ({ prev, next }) => (
    <a
        href={prev || next}
        className={classnames({
            [styles.prev]: prev,
            [styles.next]: next,
        })}
        data-prev-image={Boolean(prev)}
        data-next-image={Boolean(next)}
    >
        {prev ? 'Previous' : 'Next'} image
    </a>
);

const Photo = ({ photo, setPath, nav }) => {
    const { title, gps } = photo.meta;
    const { prev, next } = nav;
    return (
        <Container>
            <h1 className={styles.heading}>{title}</h1>
            <BackButton destination={setPath} />
            <Image photo={photo} detail />
            <div className={styles.nav}>
                {prev && (<NavLink prev={prev} />)}
                {next && (<NavLink next={next} />)}
            </div>
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
    nav: PropTypes.shape({
        prev: PropTypes.string,
        next: PropTypes.string,
    }).isRequired,
};

export default Photo;
