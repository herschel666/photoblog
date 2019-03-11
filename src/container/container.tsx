import * as React from 'react';
import { css } from 'aphrodite/no-important';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import styles from './container-styles';

interface ContainerInterface {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const Container: React.SFC<ContainerInterface> = ({
  style = {},
  className,
  children,
}) => (
  <div className={css(styles.container)}>
    <Header />
    <main className={className} style={style}>
      {children}
    </main>
    <Footer />
  </div>
);

export default Container;
