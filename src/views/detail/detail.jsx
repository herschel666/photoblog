
import React, { PropTypes } from 'react';
import Container from '../../container/container';

const Detail = ({ title, image }) => (
    <Container>
        <h1>{title}</h1>
        <img src={image} />
    </Container>
);

Detail.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
};

export default Detail;
