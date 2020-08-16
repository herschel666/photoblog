import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

import { useLink } from './page-context';
import { VisuallyHidden } from './visually-hidden';
import styles from './footer.module.css';

const FooterItem: React.SFC = ({ children }) => (
  <span className={styles.item}>{children}</span>
);

const Footer: React.SFC = () => {
  const Link = useLink();

  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.inner}>
          <FooterItem>&copy; {new Date().getFullYear()}</FooterItem>
          <FooterItem>
            <nav className={styles.nav}>
              <Link to="/imprint/">Imprint</Link>
            </nav>
          </FooterItem>
          <FooterItem>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/herschel666/photoblog/"
            >
              View source on GitHub
            </a>
          </FooterItem>
        </div>
        <div className={styles.inner}>
          <a
            href="https://github.com/herschel666"
            rel="me authn"
            className={styles.icon}
          >
            <VisuallyHidden>Github profile of Emanuel Kluge</VisuallyHidden>
            <Icon icon={faGithub} aria-hidden="true" />
          </a>
          <a
            href="https://twitter.com/herschel_r"
            rel="me"
            className={styles.icon}
          >
            <VisuallyHidden>twitter profile of Emanuel Kluge</VisuallyHidden>
            <Icon icon={faTwitter} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
