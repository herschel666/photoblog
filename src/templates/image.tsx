import React from 'react';
import classNames from 'classnames';
import { Link, graphql } from 'gatsby';
import GatsbyImage, { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import Seo from '../components/seo';
import BackButton from '../components/back-button';
import ImageMeta, { Exif } from '../components/image-meta';
import Map from '../components/map';
import ImageCaption from '../components/image-caption';
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
    file: {
      sharp: {
        fields: {
          exif: Exif;
        };
        original: {
          width: number;
        };
        fluid: FluidObject;
      };
    };
  };
  prev: Sibling;
  next: Sibling;
}

interface Props {
  data: Data;
}

export const query = graphql`
  query getImage($slug: String!, $prev: String, $next: String) {
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
      file: childImageFile {
        sharp: childImageSharp {
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
          }
          fluid(maxWidth: 1000) {
            ...GatsbyImageSharpFluid
          }
        }
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

const Image: React.SFC<Props> = ({ data }) => (
  <Layout>
    <Seo
      title={`🖼 '${data.image.frontmatter.title}'`}
      description={data.image.frontmatter.title}
    />
    <h1 className={styles.heading}>{data.image.frontmatter.title}</h1>
    <BackButton destination={data.image.fields.set} />
    <figure className={styles.figure}>
      <GatsbyImage
        fluid={data.image.file.sharp.fluid}
        alt={data.image.frontmatter.title}
        style={getImageStyles(
          data.image.file.sharp.fluid.aspectRatio,
          data.image.file.sharp.original.width
        )}
      />
      <ImageCaption
        date={data.image.frontmatter.date}
        niceDate={data.image.frontmatter.niceDate}
      >
        <span dangerouslySetInnerHTML={{ __html: data.image.html }} />
      </ImageCaption>
    </figure>
    <div className={styles.nav}>
      {data.prev.fields ? (
        <Link to={data.prev.fields.slug} className={styles.prev}>
          {data.prev.frontmatter.title}
        </Link>
      ) : (
        <span className={classNames(styles.prev, styles.hidden)} />
      )}
      {data.next.fields ? (
        <Link to={data.next.fields.slug} className={styles.next}>
          {data.next.frontmatter.title}
        </Link>
      ) : (
        <span className={classNames(styles.next, styles.hidden)} />
      )}
    </div>
    <div className={styles.metaWrap}>
      <ImageMeta
        exif={data.image.file.sharp.fields.exif}
        className={classNames(styles.meta, styles.camera)}
      />
      <Map
        coords={{
          lat: data.image.file.sharp.fields.exif.latitude,
          lng: data.image.file.sharp.fields.exif.longitude,
        }}
        className={classNames(styles.meta, styles.map)}
      />
    </div>
  </Layout>
);

export default Image;
