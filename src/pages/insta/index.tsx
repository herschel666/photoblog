import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import { useLink } from '../../components/page-context';
import Layout from '../../components/layout';
import ImageGrid from '../../components/image-grid';
import Seo from '../../components/seo';

import styles from './index.module.css';

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

interface OpenGraphNode {
  file: {
    localFile: {
      img: {
        fixed: {
          src: string;
        };
      };
    };
  };
}

interface Props {
  data: {
    insta: {
      images: Image[];
    };
    og: {
      nodes: OpenGraphNode[];
    };
  };
}

export const query = graphql`
  query instaImages {
    insta: allContentfulImage(sort: { fields: [date], order: DESC }) {
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
    og: allContentfulImage(limit: 1) {
      nodes {
        file {
          localFile {
            img: childImageSharp {
              fixed(width: 1000) {
                src
              }
            }
          }
        }
      }
    }
  }
`;

const getOpenGraphImage = (og: OpenGraphNode) => [
  {
    property: 'og:image',
    content: og.file.localFile.img.fixed.src,
  },
  { property: 'og:image:width', content: '1000' },
  { property: 'og:image:height', content: '1000' },
  { name: 'twitter:image', content: og.file.localFile.img.fixed.src },
  { name: 'twitter:image:width', content: '1000' },
  { name: 'twitter:image:height', content: '1000' },
];

const Insta: React.SFC<Props> = ({ data }) => {
  const Link = useLink();

  return (
    <>
      <Seo title="Insta" meta={getOpenGraphImage(data.og.nodes[0])} />
      <Layout>
        <h1>Insta</h1>
        <ImageGrid>
          {data.insta.images.map(({ id, file }) => (
            <figure key={id}>
              <Link to={`/insta/${id}/`} className={styles.imageLink}>
                <GatsbyImage
                  fluid={file.local.img.fluid}
                  alt={file.description}
                />
              </Link>
            </figure>
          ))}
        </ImageGrid>
      </Layout>
    </>
  );
};

export default Insta;
