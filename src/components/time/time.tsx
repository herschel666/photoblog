import * as React from 'react';
import { format } from 'date-fns';

interface TimeInterface {
  date: Date;
  className?: string;
}

const Time: React.SFC<TimeInterface> = ({ date, className }) => (
  <time className={className} dateTime={String(date)}>
    {format(date, 'YYYY/MM/DD')}
  </time>
);

export default Time;
