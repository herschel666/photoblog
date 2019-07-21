import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import classNames from 'classnames';

import Header from './header';
import Footer from './footer';
import styles from './layout.module.css';

import './layout.css';

interface Props {
  className?: string;
}

interface Site {
  meta: { title: string };
}

interface QueryResult {
  site: Site;
}

const Layout: React.SFC<Props> = ({ children, className }) => {
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
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
