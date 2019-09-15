import * as React from 'react';

import { useLink } from './page-context';
import styles from './header.module.css';

interface Props {
  title: string;
}

const Header: React.SFC<Props> = ({ title }) => {
  const Link = useLink();

  return (
    <header className={styles.header}>
      <span className={styles.title}>
        <Link to="/" className={styles.link}>
          {title}
        </Link>
      </span>
    </header>
  );
};

export default Header;
