import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

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
        <Icon icon={faChevronLeft} className={styles.icon} />
        back
      </Link>
    </div>
  );
};
export default BackButton;
