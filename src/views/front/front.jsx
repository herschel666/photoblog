
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';
import SetList from '../../components/set-list/set-list';
import styles from './front.sass';

const Front = ({ content, photo, list }) => (
    <Container
        className={styles.main}
        style={{ backgroundImage: `url("${photo.file}")` }}
        home>
        <div className={styles.inner}>
            <Text className={styles.intro} content={content} />
            <SetList list={list} />
        </div>
        <i className={styles.shade} />
    </Container>
);

Front.propTypes = {
    content: PropTypes.string.isRequired,
    photo: PropTypes.shape({
        file: PropTypes.string.isRequired,
    }),
    list: SetList.propTypes.list,
};

export default Front;
