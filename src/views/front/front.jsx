
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';
import SetList from '../../components/set-list/set-list';
import styles from './front.sass';

const Front = ({ content, list }) => (
    <Container className={styles.main} home>
        <Text className={styles.intro} content={content} />
        <SetList list={list} />
    </Container>
);

Front.propTypes = {
    content: PropTypes.string.isRequired,
    list: SetList.propTypes.list,
};

export default Front;
