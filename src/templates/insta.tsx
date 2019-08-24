import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import BackButton from '../components/back-button';
import ImageCaption from '../components/image-caption';
import Seo from '../components/seo';

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

const Insta: React.SFC<Props> = ({ data }) => (
  <>
    <Seo title={data.insta.title} />
    <Layout>
      <h1>{data.insta.title}</h1>
      <BackButton destination="/insta/" />
      <figure>
        <GatsbyImage
          fluid={data.insta.file.fluid}
          alt={data.insta.file.description}
        />
        <ImageCaption date={data.insta.date} niceDate={data.insta.niceDate}>
          <span
            dangerouslySetInnerHTML={{
              __html: data.insta.description.markdown.html,
            }}
          />
        </ImageCaption>
      </figure>
    </Layout>
  </>
);

export default Insta;
