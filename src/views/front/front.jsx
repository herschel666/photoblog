
import React, { PropTypes } from 'react';
import Container from '../../container/container';
import Text from '../../components/text/text';
import SetList from '../../components/set-list/set-list';

const Front = ({ content, photo, list }) => (
    <Container home>
        <Text content={content} />
        <img src={photo.file} />
        <SetList list={list} />
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
