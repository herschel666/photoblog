import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import classNames from 'classnames';

import Header from './header';
import Footer from './footer';
import styles from './layout.module.css';

// tslint:disable:next-line no-import-side-effect
import './layout.css';

interface Props {
  className?: string;
  aside?: React.ReactNode;
}

interface Site {
  meta: { title: string };
}

interface QueryResult {
  site: Site;
}

const Layout: React.SFC<Props> = ({ children, className, aside }) => {
  const { site } = useStaticQuery<QueryResult>(graphql`
    query SiteTitleQuery {
      site {
        meta: siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={classNames(styles.container, className)}>
      <Header title={site.meta.title} />
      <div
        className={classNames(styles.wrap, {
          [styles.hasAside]: Boolean(aside),
        })}
      >
        <main
          className={classNames({
            [styles.main]: Boolean(aside),
          })}
        >
          {children}
        </main>
        {aside && <aside className={styles.aside}>{aside}</aside>}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
