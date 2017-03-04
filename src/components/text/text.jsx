
import React, { PropTypes } from 'react';

const Text = ({ content }) => (
    <div dangerouslySetInnerHTML={{ __html: content }} />
);

Text.propTypes = {
    content: PropTypes.string.isRequired,
};

export default Text;
