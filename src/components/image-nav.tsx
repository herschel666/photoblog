import React from 'react';
import classNames from 'classnames';
import { navigate } from 'gatsby';

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
  const prevToWithAnchor = `${prevTo}#main-content`;
  const nextToWithAnchor = `${nextTo}#main-content`;
  const keydownCallback = ({ key }: KeyboardEvent) => {
    let removeListener = false;

    if (prevTo && key === 'ArrowRight') {
      navigate(prevToWithAnchor);
      removeListener = true;
    }
    if (nextTo && key === 'ArrowLeft') {
      navigate(nextToWithAnchor);
      removeListener = true;
    }
    if (removeListener) {
      document.removeEventListener('keydown', keydownCallback);
    }
  };
  const Link = useLink();

  React.useEffect(() => {
    document.addEventListener('keydown', keydownCallback);
    return () => document.removeEventListener('keydown', keydownCallback);
  }, []);

  return (
    <nav className={styles.nav}>
      {nextTo && nextCaption ? (
        <Link to={nextToWithAnchor} className={styles.next} data-testid="next">
          {nextCaption}
        </Link>
      ) : (
        <Placeholder className={styles.next} />
      )}
      {prevTo && prevCaption ? (
        <Link to={prevToWithAnchor} className={styles.prev} data-testid="prev">
          {prevCaption}
        </Link>
      ) : (
        <Placeholder className={styles.prev} />
      )}
    </nav>
  );
};

export default ImageNav;
