import * as React from 'react';
import { format } from 'date-fns';

interface TimeInterface {
  date?: Date;
  className?: string;
}

const Time: React.SFC<TimeInterface> = ({ date, className }) => {
  if (date) {
    return (
      <time className={className} dateTime={date.toISOString()}>
        {format(date, 'YYYY/MM/DD')}
      </time>
    );
  }
  return null;
};

export default Time;
