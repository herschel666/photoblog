import React from 'react';
import { Link } from 'gatsby';

import styles from './footer.module.css';

const Footer: React.SFC = () => (
  <footer className={styles.footer}>
    <>&copy; {new Date().getFullYear()} &middot;&nbsp;</>
    <nav className={styles.nav}>
      <Link to="/imprint/">Imprint</Link>
    </nav>
    <>&nbsp;&middot;&#8203;&nbsp;</>
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
