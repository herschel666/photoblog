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

interface OpenGraphNode {
  file: {
    img: {
      original: {
        width: number;
        height: number;
      };
      fixed: {
        src: string;
      };
    };
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
  og: {
    nodes: OpenGraphNode[];
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
    og: allMarkdownRemark(
      filter: { fields: { set: { eq: $slug } } }
      limit: 1
    ) {
      nodes {
        file: childImageFile {
          img: childImageSharp {
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
    }
  }
`;

const getOpenGraphImage = (og: OpenGraphNode) => {
  const width = String(og.file.img.original.width);
  const height = String(og.file.img.original.height);

  return [
    {
      property: 'og:image',
      content: og.file.img.fixed.src,
    },
    { property: 'og:image:width', content: width },
    { property: 'og:image:height', content: height },
    { name: 'twitter:image', content: og.file.img.fixed.src },
    { name: 'twitter:image:width', content: width },
    { name: 'twitter:image:height', content: height },
  ];
};

const Set: React.SFC<Props> = ({ data, path }) => {
  const Link = useLink();

  return (
    <Layout>
      <Seo
        title={data.content.frontmatter.title}
        description={data.content.frontmatter.title}
        meta={getOpenGraphImage(data.og.nodes[0])}
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
        {data.images.nodes.map(({ id, fields, frontmatter, file }, i) => (
          <figure key={id}>
            <Link
              to={`${fields.slug}#main-content`}
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
