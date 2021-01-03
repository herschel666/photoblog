import React from 'react';
import { graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import { useLink } from '../components/page-context';
import Layout from '../components/layout';
import Text from '../components/text';
import Seo from '../components/seo';
import ImageGrid from '../components/image-grid';
import BackButton from '../components/back-button';
import ShareButton from '../components/share-button';

import styles from './set.module.css';

interface ImageFileNode {
  original: {
    width: number;
    height: number;
  };
  fields: {
    slug: string;
  };
  fluid: FluidObject;
  fixed: { src: string };
}

interface ImageNode {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
  };
}

interface Data {
  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
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
  file: {
    nodes: ImageFileNode[];
  };
}

interface Props {
  path: string;
  data: Data;
}

export const query = graphql`
  query getSet($slug: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
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
      }
    }
    file: allImageSharp(filter: { fields: { set: { eq: $slug } } }) {
      nodes {
        original {
          width
          height
        }
        fields {
          slug
        }
        fluid(maxWidth: 230, maxHeight: 230) {
          ...GatsbyImageSharpFluid
        }
        original {
          width
          height
        }
        fixed(width: 1000) {
          src
        }
      }
    }
  }
`;

const getOpenGraphImage = (width: string, height: string, src: string) => [
  {
    property: 'og:image',
    content: src,
  },
  { property: 'og:image:width', content: width },
  { property: 'og:image:height', content: height },
  { name: 'twitter:image', content: src },
  { name: 'twitter:image:width', content: width },
  { name: 'twitter:image:height', content: height },
];

const getImage = (
  files: ImageFileNode[],
  slug: string
): FluidObject | never => {
  const image = files.find((file) => file.fields.slug === slug);
  if (!image) {
    throw new Error(`Could not find image for slug "${slug}".`);
  }
  return image.fluid;
};

const Set: React.SFC<Props> = ({ data, path }) => {
  const Link = useLink();
  const files = data.file.nodes;
  const [og] = files;

  return (
    <Layout>
      <Seo
        title={data.content.frontmatter.title}
        description={data.content.frontmatter.title}
        meta={getOpenGraphImage(
          String(og.original.width),
          String(og.original.height),
          og.fixed.src
        )}
      />
      <h1>{data.content.frontmatter.title}</h1>
      <time dateTime={data.content.frontmatter.date} className={styles.pubdate}>
        {data.content.frontmatter.niceDate}
      </time>
      <Text className={styles.description} content={data.content.html} />
      <div className={styles.links}>
        <BackButton destination="/" />
        <ShareButton
          url={`${data.site.siteMetadata.siteUrl}${path}`}
          title={data.content.frontmatter.title}
        />
      </div>
      <ImageGrid>
        {data.images.nodes.map(({ id, fields, frontmatter }, i) => (
          <figure key={id}>
            <Link
              to={`${fields.slug}#main-content`}
              className={styles.imageLink}
              data-testid={`img-link-${i}`}
            >
              <GatsbyImage
                fluid={getImage(files, fields.slug)}
                alt={frontmatter.title}
                className={styles.image}
              />
            </Link>
            <figcaption className={styles.caption}>
              <Link to={`${fields.slug}#main-content`}>
                {frontmatter.title}
              </Link>
            </figcaption>
          </figure>
        ))}
      </ImageGrid>
      <BackButton destination="/" />
    </Layout>
  );
};

export default Set;
