
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';
import Time from '../../components/time/time';
import Gallery from '../../components/gallery/gallery';
import Comments from '../../components/comments/comments';
import styles from './set.sass';

const Set = ({ title, published, content, photos }) => (
    <Container>
        <h1 className={styles.heading}>{title}</h1>
        <Time date={published} className={styles.pubdate} />
        <Text className={styles.description} content={content} />
        <Gallery photos={photos} />
        <Comments />
    </Container>
);

Set.propTypes = {
    title: PropTypes.string.isRequired,
    published: PropTypes.instanceOf(Date).isRequired,
    content: PropTypes.string.isRequired,
    photos: Gallery.propTypes.photos,
};

export default Set;
