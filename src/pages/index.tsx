import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import Text from '../components/text';
import SetList, { Album } from '../components/set-list';
import styles from './index.module.css';

interface Node {
  id: string;
  fields: { slug: string };
  frontmatter: {
    title: string;
    date: string;
    niceDate: string;
  };
}

interface Props {
  data: {
    sets: {
      nodes: Node[];
    };
  };
}

export const query = graphql`
  {
    sets: allMarkdownRemark(
      filter: { fields: { type: { eq: "sets" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
          date
          niceDate: date(formatString: "YYYY/MM/DD")
        }
      }
    }
  }
`;

const pickProps = (node: Node): Album => ({
  id: node.id,
  slug: node.fields.slug,
  title: node.frontmatter.title,
  date: node.frontmatter.date,
  niceDate: node.frontmatter.niceDate,
});

const IndexPage: React.SFC<Props> = ({ data }) => (
  <>
    <Seo title="📷" description="📷" />
    <Layout>
      <Text className={styles.intro}>
        <p>Welcome to my cyberspace online photo album!!</p>
      </Text>
      <SetList albums={data.sets.nodes.map(pickProps)} />
    </Layout>
  </>
);

export default IndexPage;
