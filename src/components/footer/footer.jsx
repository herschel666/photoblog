
import React from 'react';
import styles from './footer.sass';

const Footer = () => (
    <footer className={styles.footer}>
        &copy; {(new Date()).getFullYear()} &middot;&nbsp;
        <a href="/imprint/">Imprint</a>
    </footer>
);

export default Footer;
