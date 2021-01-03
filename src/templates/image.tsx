import React from 'react';
import classNames from 'classnames';
import { graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import Seo from '../components/seo';
import BackButton from '../components/back-button';
import ImageMeta, { Exif } from '../components/image-meta';
import Map from '../components/map';
import ImageCaption from '../components/image-caption';
import ImageNav from '../components/image-nav';
import ShareButton from '../components/share-button';

import styles from './image.module.css';

interface Sibling {
  fields: {
    slug: string;
  } | null;
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
  image: {
    fields: {
      // tslint:disable:next-line no-reserved-keywords
      set: string;
      slug: string;
    };
    frontmatter: {
      title: string;
      description: string;
      date: string;
      niceDate: string;
    };
    html: string;
  };
  file: {
    fields: {
      exif: Exif;
    };
    original: {
      width: number;
      height: number;
    };
    fluid: FluidObject;
    og: {
      src: string;
    };
  };
  prev: Sibling;
  next: Sibling;
}

interface Props {
  data: Data;
  path: string;
}

export const query = graphql`
  query getImage($slug: String!, $prev: String, $next: String) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    image: markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        set
        slug
      }
      frontmatter {
        title
        date
        niceDate: date(formatString: "YYYY/MM/DD HH:mm")
      }
      html
    }
    file: imageSharp(fields: { slug: { eq: $slug } }) {
      fields {
        exif {
          latitude
          longitude
          camera
          lens
          iso
          aperture
          focalLength
          exposureTime
          flash
        }
      }
      original {
        width
        height
      }
      fluid(maxWidth: 1000) {
        ...GatsbyImageSharpFluid
      }
      og: fixed(width: 1000) {
        src
      }
    }
    prev: markdownRemark(fields: { slug: { eq: $prev } }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(fields: { slug: { eq: $next } }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;

const getImageStyles = (
  aspectRatio: FluidObject['aspectRatio'],
  width: number
): React.CSSProperties => {
  if (aspectRatio >= 1) {
    return {};
  }
  return {
    maxWidth: `${aspectRatio * width}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
  };
};

const getOpenGraphImage = (data: Data) => {
  const width = String(data.file.original.width);
  const height = String(data.file.original.height);

  return [
    {
      property: 'og:image',
      content: data.file.og.src,
    },
    { property: 'og:image:width', content: width },
    { property: 'og:image:height', content: height },
    { name: 'twitter:image', content: data.file.og.src },
    { name: 'twitter:image:alt', content: data.image.frontmatter.title },
    { name: 'twitter:image:width', content: width },
    { name: 'twitter:image:height', content: height },
  ];
};

const Image: React.SFC<Props> = ({ data, path }) => {
  const prevTo = data.prev.fields ? data.prev.fields.slug : void 0;
  const prevCaption = data.prev.frontmatter.title || void 0;
  const nextTo = data.next.fields ? data.next.fields.slug : void 0;
  const nextCaption = data.next.frontmatter.title || void 0;

  return (
    <Layout>
      <Seo
        title={`🖼 '${data.image.frontmatter.title}'`}
        description={data.image.frontmatter.title}
        twitterCard="summary_large_image"
        openGraphType="article"
        meta={getOpenGraphImage(data)}
      />
      <h1 className={styles.heading}>{data.image.frontmatter.title}</h1>
      <div className={styles.links}>
        <BackButton destination={data.image.fields.set} />
        <ShareButton
          url={`${data.site.siteMetadata.siteUrl}${path}`}
          title={data.image.frontmatter.title}
        />
      </div>
      <figure className={styles.figure}>
        <GatsbyImage
          fluid={data.file.fluid}
          alt={data.image.frontmatter.title}
          style={getImageStyles(
            data.file.fluid.aspectRatio,
            data.file.original.width
          )}
        />
        <ImageCaption
          date={data.image.frontmatter.date}
          niceDate={data.image.frontmatter.niceDate}
        >
          {Boolean(data.image.html) && (
            <span dangerouslySetInnerHTML={{ __html: data.image.html }} />
          )}
        </ImageCaption>
      </figure>
      <ImageNav
        prevTo={prevTo}
        prevCaption={prevCaption}
        nextTo={nextTo}
        nextCaption={nextCaption}
      />
      <div className={styles.metaWrap}>
        <ImageMeta
          exif={data.file.fields.exif}
          className={classNames(styles.meta, styles.camera)}
        />
        <Map
          coords={{
            lat: data.file.fields.exif.latitude,
            lng: data.file.fields.exif.longitude,
          }}
          className={classNames(styles.meta, styles.map)}
        />
      </div>
    </Layout>
  );
};

export default Image;
