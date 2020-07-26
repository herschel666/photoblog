import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import { useLink } from '../components/page-context';
import Layout from '../components/layout';
import Seo from '../components/seo';
import Text from '../components/text';
import SetList, { Album } from '../components/set-list';
import styles from './index.module.css';

interface Set {
  id: string;
  fields: { slug: string };
  frontmatter: {
    title: string;
    date: string;
    niceDate: string;
    poster: {
      image: {
        fluid: FluidObject;
      };
    };
  };
}

interface Image {
  id: string;
  file: {
    description: string;
    local: {
      img: {
        fluid: FluidObject;
      };
    };
  };
}

interface Props {
  data: {
    sets: {
      nodes: Set[];
    };
    insta: {
      images: Image[];
    };
  };
}

export const query = graphql`
  query frontPage {
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
          poster {
            image: childImageSharp {
              fluid(maxWidth: 1000, maxHeight: 150, quality: 5) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
    insta: allContentfulImage(sort: { fields: [date], order: DESC }, limit: 3) {
      images: nodes {
        id: contentful_id
        file {
          description
          local: localFile {
            img: childImageSharp {
              fluid(maxWidth: 230, maxHeight: 230, fit: CONTAIN) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`;

const pickProps = (node: Set): Album => ({
  id: node.id,
  slug: node.fields.slug,
  title: node.frontmatter.title,
  date: node.frontmatter.date,
  niceDate: node.frontmatter.niceDate,
  poster: node.frontmatter.poster.image.fluid,
});

const IndexPage: React.SFC<Props> = ({ data }) => {
  const Link = useLink();

  return (
    <>
      <Seo title="📷" description="📷" />
      <Layout
        aside={
          <>
            <h3 className={styles.headline}>Insta Feed</h3>
            <div className={styles.list}>
              {data.insta.images.map(({ id, file }) => (
                <figure key={id} className={styles.image}>
                  <Link
                    to={`/insta/${id}/#main-content`}
                    className={styles.imageLink}
                  >
                    <GatsbyImage
                      fluid={file.local.img.fluid}
                      alt={file.description}
                    />
                  </Link>
                </figure>
              ))}
            </div>
            <Link to={`/insta/`}>View all images</Link>
          </>
        }
      >
        <Text className={styles.intro}>
          <p>Welcome to my cyberspace online photo album!!</p>
        </Text>
        <SetList albums={data.sets.nodes.map(pickProps)} />
      </Layout>
    </>
  );
};

export default IndexPage;
