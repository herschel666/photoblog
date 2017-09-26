import * as React from 'react';
import { css } from 'aphrodite/no-important';
import styles from './header-styles';

interface HeaderInterface {
  home?: boolean;
}

const title = 'ek|photos';

const Header: React.SFC<HeaderInterface> = ({ home }) => (
  <header className={css(styles.header)}>
    <span className={css(styles.title)}>
      {Boolean(home) ? (
        title
      ) : (
        <a href="/" className={css(styles.link)}>
          {title}
        </a>
      )}
    </span>
  </header>
);

export default Header;
