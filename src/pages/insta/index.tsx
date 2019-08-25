import React from 'react';
import { Link, graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import Layout from '../../components/layout';
import ImageGrid from '../../components/image-grid';
import Seo from '../../components/seo';

import styles from './index.module.css';

interface Image {
  id: string;
  title: string;
  file: {
    description: string;
    fluid: FluidObject;
  };
}

interface Props {
  data: {
    insta: {
      images: Image[];
    };
  };
}

export const query = graphql`
  query instaImages {
    insta: allContentfulImage(sort: { fields: [date], order: DESC }) {
      images: nodes {
        id: contentful_id
        title
        file {
          description
          fluid(maxWidth: 230, maxHeight: 230) {
            ...GatsbyContentfulFluid
          }
        }
      }
    }
  }
`;

const Insta: React.SFC<Props> = ({ data }) => (
  <>
    <Seo title="Insta" />
    <Layout>
      <h1>Insta</h1>
      <ImageGrid>
        {data.insta.images.map(({ id, title, file }) => (
          <figure key={id}>
            <Link to={`/insta/${id}/`} className={styles.imageLink}>
              <GatsbyImage fluid={file.fluid} alt={file.description} />
              <figcaption>{title}</figcaption>
            </Link>
          </figure>
        ))}
      </ImageGrid>
    </Layout>
  </>
);

export default Insta;
