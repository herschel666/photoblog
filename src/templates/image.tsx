import React from 'react';
import classNames from 'classnames';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import Seo from '../components/seo';
import BackButton from '../components/back-button';
import Photo from '../components/photo';
import ImageMeta, { Exif } from '../components/image-meta';
import Map from '../components/map';
import styles from './image.module.css';

interface Data {
  content: {
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
  };
  image: {
    fields: {
      exif: Exif;
    };
    original: {
      width: number;
    };
    fluid: FluidObject;
  };
}

interface Props {
  data: Data;
}

export const query = graphql`
  query getImage($slug: String!) {
    content: markdownRemark(fields: { slug: { eq: $slug } }) {
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
    }
    image: imageSharp(fields: { slug: { eq: $slug } }) {
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
`;

const Image: React.SFC<Props> = ({ data }) => (
  <Layout>
    <Seo
      title={`🖼 '${data.content.frontmatter.title}'`}
      description={data.content.frontmatter.title}
    />
    <h1 className={styles.heading}>{data.content.frontmatter.title}</h1>
    <BackButton destination={`/${data.content.fields.set}/`} />
    <Photo
      slug={data.content.fields.slug}
      src={{ ...data.image.fluid, width: data.image.original.width }}
      title={data.content.frontmatter.title}
      description={data.content.html}
      date={data.content.frontmatter.date}
      relativeDate={data.content.frontmatter.relativeDate}
      isDetail={true}
    />
    {/* <div className={styles.nav}>
      {prev ? (
        <Link {...prev.linkProps}>
          <a className={styles.prev}>{prev.title}</a>
        </Link>
      ) : (
        <span className={classNames(styles.prev, styles.hidden)} />
      )}
      {next ? (
        <Link {...next.linkProps}>
          <a className={styles.next}>{next.title}</a>
        </Link>
      ) : (
        <span className={classNames(styles.next, styles.hidden)} />
      )}
    </div> */}
    <div className={styles.metaWrap}>
      <ImageMeta
        exif={data.image.fields.exif}
        className={classNames(styles.meta, styles.camera)}
      />
      <Map
        coords={{
          lat: data.image.fields.exif.latitude,
          lng: data.image.fields.exif.longitude,
        }}
        className={classNames(styles.meta, styles.map)}
      />
    </div>
  </Layout>
);

export default Image;
