import React from 'react';
import { Link, graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import Text from '../components/text';
import Seo from '../components/seo';
import BackButton from '../components/back-button';
import styles from './set.module.css';

interface ImageFileNode {
  sharp: {
    original: {
      width: number;
    };
    fluid: FluidObject;
  };
}

interface ImageNode {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
  };
  file: ImageFileNode;
}

interface Data {
  content: {
    frontmatter: {
      title: string;
      date: string;
      relativeDate: string;
    };
    html: string;
  };
  images: {
    nodes: ImageNode[];
  };
}

interface Props {
  data: Data;
}

export const query = graphql`
  query getSet($slug: String!) {
    content: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
        relativeDate: date(fromNow: true)
      }
      html
    }
    images: allMarkdownRemark(filter: { fields: { set: { eq: $slug } } }) {
      nodes {
        id
        fields {
          slug
        }
        frontmatter {
          title
        }
        file: childImageFile {
          sharp: childImageSharp {
            original {
              width
            }
            fluid(maxWidth: 230, maxHeight: 230) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;

const Set: React.SFC<Props> = ({ data }) => (
  <Layout>
    <Seo
      title={data.content.frontmatter.title}
      description={data.content.frontmatter.title}
    />
    <h1>{data.content.frontmatter.title}</h1>
    <time dateTime={data.content.frontmatter.date} className={styles.pubdate}>
      {data.content.frontmatter.relativeDate}
    </time>
    <Text className={styles.description} content={data.content.html} />
    <BackButton destination="/" />
    <section className={styles.grid}>
      {data.images.nodes.map(({ id, fields, frontmatter, file }) => (
        <figure key={id}>
          <Link to={fields.slug}>
            <GatsbyImage
              fluid={file.sharp.fluid}
              alt={frontmatter.title}
              className={styles.image}
            />
          </Link>
          <figcaption className={styles.caption}>
            <Link to={fields.slug}>{frontmatter.title}</Link>
          </figcaption>
        </figure>
      ))}
    </section>
    <BackButton destination="/" />
  </Layout>
);

export default Set;
