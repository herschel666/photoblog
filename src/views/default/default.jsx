
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import BackButton from '../../components/back-button/back-button';
import Text from '../../components/text/text';
import styles from './default.sass';

const Default = ({ title, content }) => (
    <Container>
        <BackButton destination="/" />
        <h1 className={styles.heading}>{title}</h1>
        <Text content={content} />
    </Container>
);

Default.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default Default;
