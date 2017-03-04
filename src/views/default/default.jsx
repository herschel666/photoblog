
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';

const Default = ({ title, content }) => (
    <Container>
        <h1>{title}</h1>
        <Text content={content} />
    </Container>
);

Default.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default Default;
