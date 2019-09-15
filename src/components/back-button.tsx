import React from 'react';

import { useLink } from './page-context';
import styles from './back-button.module.css';

interface Props {
  destination: string;
}

const BackButton: React.SFC<Props> = ({ destination }) => {
  const Link = useLink();

  return (
    <div className={styles.wrap}>
      <Link to={destination} className={styles.button}>
        back
      </Link>
    </div>
  );
};
export default BackButton;
