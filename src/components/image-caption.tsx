import React from 'react';
import classNames from 'classnames';

import styles from './image-caption.module.css';

interface Props {
  date: string;
  niceDate: string;
  needsDash?: boolean;
}

const ImageCaption: React.SFC<Props> = ({
  date,
  niceDate,
  needsDash,
  children,
}) => (
  <figcaption className={styles.caption}>
    <time
      dateTime={date}
      className={classNames(styles.time, {
        [styles.needsDash]:
          needsDash === void 0 ? Boolean(children) : needsDash,
      })}
    >
      {niceDate}
    </time>
    {children}
  </figcaption>
);

export default ImageCaption;
