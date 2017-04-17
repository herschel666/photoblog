
import React from 'react';
import styles from './footer.sass';

const Footer = () => (
    <footer className={styles.footer} data-turbolinks-permanent>
        &copy; {(new Date()).getFullYear()} &middot;&nbsp;
        <a href="/imprint/">Imprint</a> &middot;&nbsp;
        <a
            target="_blank"
            rel="noopener, noreferrer"
            href="https://github.com/herschel666/photoblog/"
        >View source on GitHub</a>
    </footer>
);

export default Footer;
