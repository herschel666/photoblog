import React from 'react';
import { Link } from 'gatsby';
import styles from './back-button.module.css';

interface Props {
  destination: string;
}

const BackButton: React.SFC<Props> = ({ destination }) => (
  <div className={styles.wrap}>
    <Link to={destination} className={styles.button}>
      back
    </Link>
  </div>
);

export default BackButton;
