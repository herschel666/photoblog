
import React, { PropTypes } from 'react';
import { format } from 'date-fns';

const Time = ({ date, className = '' }) => (
    <time className={className} dateTime={String(date)}>
        {format(date, 'YYYY/MM/DD')}
    </time>
);

Time.propTypes = {
    date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
    ]).isRequired,
    className: PropTypes.string,
};

export default Time;
