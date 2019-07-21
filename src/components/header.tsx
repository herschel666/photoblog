import * as React from 'react';
import { Link } from 'gatsby';
import styles from './header.module.css';

interface Props {
  title: string;
}

const Header: React.SFC<Props> = ({ title }) => (
  <header className={styles.header}>
    <span className={styles.title}>
      <Link to="/" className={styles.link}>
        {title}
      </Link>
    </span>
  </header>
);

export default Header;
