import React from 'react';
import classNames from 'classnames';
import { Link } from 'gatsby';

import styles from './image-nav.module.css';

interface Props {
  prevTo?: string;
  prevCaption?: string;
  nextTo?: string;
  nextCaption?: string;
}

const Placeholder: React.SFC<{ className: string }> = ({ className }) => (
  <span className={classNames(className, styles.hidden)} />
);

const ImageNav: React.SFC<Props> = ({
  prevTo,
  prevCaption,
  nextTo,
  nextCaption,
}) => (
  <nav className={styles.nav}>
    {nextTo && nextCaption ? (
      <Link to={nextTo} className={styles.next}>
        {nextCaption}
      </Link>
    ) : (
      <Placeholder className={styles.next} />
    )}
    {prevTo && prevCaption ? (
      <Link to={prevTo} className={styles.prev}>
        {prevCaption}
      </Link>
    ) : (
      <Placeholder className={styles.prev} />
    )}
  </nav>
);

export default ImageNav;
