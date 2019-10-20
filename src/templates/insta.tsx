import React from 'react';
import { graphql } from 'gatsby';
import classNames from 'classnames';
import GatsbyImage, { FluidObject } from 'gatsby-image';
import emojiRegex from 'emoji-regex';

import Layout from '../components/layout';
import BackButton from '../components/back-button';
import ImageCaption from '../components/image-caption';
import ImageNav from '../components/image-nav';
import Seo from '../components/seo';

import styles from './insta.module.css';

interface Data {
  title: string;
  description: {
    description: string;
    markdown: { html: string };
  };
  tags: string[];
  date: string;
  niceDate: string;
  file: {
    description: string;
    local: {
      img: {
        fluid: FluidObject;
        og: {
          src: string;
        };
      };
    };
  };
}

interface Props {
  data: { insta: Data };
  pageContext: {
    prev?: string;
    next?: string;
  };
}

const EMOJI_REGEX = new RegExp(
  `^(${emojiRegex()
    .toString()
    .replace(/\/g$/, '')}´|\\s)+$`
);

export const query = graphql`
  query getInsta($id: String!) {
    insta: contentfulImage(contentful_id: { eq: $id }) {
      title
      description {
        description
        markdown: childMarkdownRemark {
          html
        }
      }
      tags
      date
      niceDate: date(formatString: "YYYY/MM/DD HH:mm")
      file {
        description
        local: localFile {
          img: childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
            }
            og: fixed(width: 1000, height: 1000) {
              src
            }
          }
        }
      }
    }
  }
`;

const getOpenGraphImage = (data: Data) => [
  {
    property: 'og:image',
    content: data.file.local.img.og.src,
  },
  { property: 'og:image:width', content: '1000' },
  { property: 'og:image:height', content: '1000' },
  { name: 'twitter:image', content: data.file.local.img.og.src },
  { name: 'twitter:image:alt', content: data.file.description },
  { name: 'twitter:image:width', content: '1000' },
  { name: 'twitter:image:height', content: '1000' },
];

const isEmojiOnly = (text: string): boolean =>
  text.length < 6 && Boolean(EMOJI_REGEX.exec(text));

const Insta: React.SFC<Props> = ({ data, pageContext }) => {
  const prevTo = pageContext.prev && `/insta/${pageContext.prev}/`;
  const nextTo = pageContext.next && `/insta/${pageContext.next}/`;
  const descriptionIsEmojisOnly = isEmojiOnly(
    data.insta.description.description
  );
  const needsDash = descriptionIsEmojisOnly ? false : void 0;

  return (
    <>
      <Seo
        title={data.insta.title}
        description={data.insta.description.description}
        twitterCard="summary_large_image"
        openGraphType="article"
        meta={getOpenGraphImage(data.insta)}
      />
      <Layout>
        <h1>{data.insta.title}</h1>
        <BackButton destination="/insta/" />
        <figure className={styles.figure}>
          <GatsbyImage
            fluid={data.insta.file.local.img.fluid}
            alt={data.insta.file.description}
          />
          <ImageCaption
            date={data.insta.date}
            niceDate={data.insta.niceDate}
            needsDash={needsDash}
          >
            {Boolean(data.insta.description.markdown.html) && (
              <span
                className={classNames({
                  [styles.bigDescription]: descriptionIsEmojisOnly,
                })}
                dangerouslySetInnerHTML={{
                  __html: data.insta.description.markdown.html.replace(
                    /\n+/g,
                    ''
                  ),
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
