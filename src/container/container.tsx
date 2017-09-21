import * as React from 'react';
import { css } from 'aphrodite/no-important';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import styles from './container-styles';

interface Props {
  style?: React.CSSProperties;
  className?: string;
  home?: boolean;
  children: React.ReactNode;
}

const Container: React.SFC<Props> = ({ style, className, home, children }) => (
  <div className={css(styles.container)}>
    <Header home={Boolean(home)} />
    <main className={className} style={style || {}}>
      {children}
    </main>
    <Footer />
  </div>
);

export default Container;
