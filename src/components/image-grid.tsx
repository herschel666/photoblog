import React from 'react';

import styles from './image-grid.module.css';

const ImageGrid: React.SFC = ({ children }) => (
  <section className={styles.grid}>{children}</section>
);

export default ImageGrid;
