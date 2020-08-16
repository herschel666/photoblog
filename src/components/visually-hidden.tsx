import React from 'react';

import styles from './visually-hidden.module.css';

export const VisuallyHidden: React.SFC = ({ children }) => (
  <span className={styles.visuallyHidden}>{children}</span>
);
