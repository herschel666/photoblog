
import React, { PropTypes } from 'react';

const Text = ({ content, className = '' }) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
);

Text.propTypes = {
    content: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Text;
