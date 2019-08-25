import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import BackButton from '../components/back-button';
import ImageCaption from '../components/image-caption';
import ImageNav from '../components/image-nav';
import Seo from '../components/seo';

import styles from './insta.module.css';

interface Data {
  title: string;
  description: {
    markdown: { html: string };
  };
  tags: string[];
  date: string;
  niceDate: string;
  file: {
    description: string;
    fluid: FluidObject;
  };
}

interface Props {
  data: { insta: Data };
  pageContext: {
    prev?: string;
    next?: string;
  };
}

export const query = graphql`
  query getInsta($id: String!) {
    insta: contentfulImage(contentful_id: { eq: $id }) {
      title
      description {
        markdown: childMarkdownRemark {
          html
        }
      }
      tags
      date
      niceDate: date(formatString: "YYYY/MM/DD HH:mm")
      file {
        description
        fluid(maxWidth: 1000) {
          ...GatsbyContentfulFluid
        }
      }
    }
  }
`;

const Insta: React.SFC<Props> = ({ data, pageContext }) => {
  const prevTo = pageContext.prev && `/insta/${pageContext.prev}/`;
  const nextTo = pageContext.next && `/insta/${pageContext.next}/`;

  return (
    <>
      <Seo title={data.insta.title} />
      <Layout>
        <h1>{data.insta.title}</h1>
        <BackButton destination="/insta/" />
        <figure className={styles.figure}>
          <GatsbyImage
            fluid={data.insta.file.fluid}
            alt={data.insta.file.description}
          />
          <ImageCaption date={data.insta.date} niceDate={data.insta.niceDate}>
            {Boolean(data.insta.description.markdown.html) && (
              <span
                dangerouslySetInnerHTML={{
                  __html: data.insta.description.markdown.html,
                }}
              />
            )}
          </ImageCaption>
        </figure>
        <ImageNav
          prevTo={prevTo}
          prevCaption="prev"
          nextTo={nextTo}
          nextCaption="next"
        />
      </Layout>
    </>
  );
};

export default Insta;
