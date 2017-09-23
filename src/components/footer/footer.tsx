import * as React from 'react';
import Link from 'next/link';
import { css } from 'aphrodite/no-important';
import phox from 'phox/typings';
import styles from './footer-styles';

const createLink = (name: string): phox.LinkProps => ({
  href: {
    pathname: '/default',
    query: { page: name },
  },
  as: { pathname: `/${name}/` },
});

const Footer = () => (
  <footer className={css(styles.footer)}>
    <span>&copy; {new Date().getFullYear()} &middot;&nbsp;</span>
    <Link {...createLink('imprint')}>
      <a>Imprint</a>
    </Link>
    <span>&middot;&nbsp;</span>
    <Link {...createLink('help')}>
      <a>Help</a>
    </Link>
    <span>&middot;&nbsp;</span>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/herschel666/photoblog/"
    >
      View source on GitHub
    </a>
  </footer>
);

export default Footer;