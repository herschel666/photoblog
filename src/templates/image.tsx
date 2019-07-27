import React from 'react';
import classNames from 'classnames';
import { Link, graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import Seo from '../components/seo';
import BackButton from '../components/back-button';
import Photo from '../components/photo';
import ImageMeta, { Exif } from '../components/image-meta';
import Map from '../components/map';
import styles from './image.module.css';

interface Sibling {
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
  };
}

interface Data {
  image: {
    fields: {
      set: string;
      slug: string;
    };
    frontmatter: {
      title: string;
      description: string;
      date: string;
      relativeDate: string;
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
  prev: Sibling | null;
  next: Sibling | null;
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
        relativeDate: date(fromNow: true)
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

const Image: React.SFC<Props> = ({ data }) => (
  <Layout>
    <Seo
      title={`🖼 '${data.image.frontmatter.title}'`}
      description={data.image.frontmatter.title}
    />
    <h1 className={styles.heading}>{data.image.frontmatter.title}</h1>
    <BackButton destination={`/${data.image.fields.set}/`} />
    <Photo
      slug={data.image.fields.slug}
      src={{
        ...data.image.file.sharp.fluid,
        width: data.image.file.sharp.original.width,
      }}
      title={data.image.frontmatter.title}
      description={data.image.html}
      date={data.image.frontmatter.date}
      relativeDate={data.image.frontmatter.relativeDate}
      isDetail={true}
    />
    <div className={styles.nav}>
      {data.prev ? (
        <Link to={data.prev.fields.slug} className={styles.prev}>
          {data.prev.frontmatter.title}
        </Link>
      ) : (
        <span className={classNames(styles.prev, styles.hidden)} />
      )}
      {data.next ? (
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
