import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import styles from './default.module.css';

interface Data {
  content: {
    frontmatter: { title: string };
    html: string;
  };
}

interface Props {
  data: Data;
}

export const query = graphql`
  query defaultPage($slug: String!) {
    content: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      html
    }
  }
`;

const DefaultPage: React.SFC<Props> = ({ data }) => (
  <Layout>
    <h2 className={styles.heading}>{data.content.frontmatter.title}</h2>
    <div dangerouslySetInnerHTML={{ __html: data.content.html }} />
  </Layout>
);

export default DefaultPage;
