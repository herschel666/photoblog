import * as React from 'react';
import Link from 'next/link';
import { css } from 'aphrodite/no-important';
import styles from './header-styles';

const title = 'ek|photos';

const Header: React.SFC = () => (
  <header className={css(styles.header)}>
    <span className={css(styles.title)}>
      <Link href="/">
        <a className={css(styles.link)}>{title}</a>
      </Link>
    </span>
  </header>
);

export default Header;
