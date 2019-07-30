import React from 'react';
import classNames from 'classnames';

import styles from './image-caption.module.css';

interface Props {
  date: string;
  relativeDate: string;
}

const ImageCaption: React.SFC<Props> = ({ date, relativeDate, children }) => (
  <figcaption className={styles.caption}>
    <time
      dateTime={date}
      className={classNames(styles.time, {
        [styles.needsDash]: Boolean(children),
      })}
    >
      {relativeDate}
    </time>
    {children}
  </figcaption>
);

export default ImageCaption;
