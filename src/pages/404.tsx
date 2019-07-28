import React from 'react';

import Layout from '../components/layout';
import Seo from '../components/seo';
import Text from '../components/text';
import styles from './404.module.css';

const NotFoundPage: React.SFC = () => (
  <Layout>
    <Seo title="404: Not found" />
    <h1 className={styles.heading}>Not found</h1>
    <Text>
      You just hit a route that doesn&#39;t exist&hellip; the sadness.
    </Text>
  </Layout>
);

export default NotFoundPage;
