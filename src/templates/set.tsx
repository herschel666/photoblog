import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import { useLink } from '../components/page-context';
import Layout from '../components/layout';
import Text from '../components/text';
import Seo from '../components/seo';
import ImageGrid from '../components/image-grid';
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
      niceDate: string;
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
        niceDate: date(formatString: "YYYY/MM/DD HH:mm")
      }
      html
    }
    images: allMarkdownRemark(
      filter: { fields: { set: { eq: $slug } } }
      sort: { fields: [frontmatter___date], order: ASC }
    ) {
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

const Set: React.SFC<Props> = ({ data }) => {
  const Link = useLink();

  return (
    <Layout>
      <Seo
        title={data.content.frontmatter.title}
        description={data.content.frontmatter.title}
      />
      <h1>{data.content.frontmatter.title}</h1>
      <time dateTime={data.content.frontmatter.date} className={styles.pubdate}>
        {data.content.frontmatter.niceDate}
      </time>
      <Text className={styles.description} content={data.content.html} />
      <BackButton destination="/" />
      <ImageGrid>
        {data.images.nodes.map(({ id, fields, frontmatter, file }, i) => (
          <figure key={id}>
            <Link
              to={fields.slug}
              className={styles.imageLink}
              data-testid={`img-link-${i}`}
            >
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
      </ImageGrid>
      <BackButton destination="/" />
    </Layout>
  );
};

export default Set;
