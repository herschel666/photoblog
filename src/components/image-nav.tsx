import React from 'react';
import classNames from 'classnames';

import { useLink } from './page-context';
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
}) => {
  const Link = useLink();

  return (
    <nav className={styles.nav}>
      {nextTo && nextCaption ? (
        <Link to={nextTo} className={styles.next} data-testid="next">
          {nextCaption}
        </Link>
      ) : (
        <Placeholder className={styles.next} />
      )}
      {prevTo && prevCaption ? (
        <Link to={prevTo} className={styles.prev} data-testid="prev">
          {prevCaption}
        </Link>
      ) : (
        <Placeholder className={styles.prev} />
      )}
    </nav>
  );
};

export default ImageNav;
