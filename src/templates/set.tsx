import React from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import Layout from '../components/layout';
import Text from '../components/text';
import Seo from '../components/seo';
import Photo from '../components/photo';
import BackButton from '../components/back-button';
import styles from './set.module.css';

interface ImageMetaNode {
  id: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    date: string;
    relativeDate: string;
  };
}

interface ImageFileNode {
  parent: {
    name: string;
  };
  original: {
    width: number;
  };
  fluid: FluidObject;
}

interface ImageNode {
  id: string;
  slug: string;
  title: string;
  date: string;
  relativeDate: string;
  src: FluidObject & { width: number };
}

interface Data {
  content: {
    frontmatter: {
      title: string;
      date: string;
      relativeDate: string;
    };
    html: string;
  };
  imagesMeta: {
    nodes: ImageMetaNode[];
  };
  imagesFile: {
    nodes: { children: ImageFileNode[] }[];
  };
}

interface Props {
  data: Data;
}

export const query = graphql`
  query getSet($slug: String!, $name: String!) {
    content: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
        relativeDate: date(fromNow: true)
      }
      html
    }
    imagesMeta: allMarkdownRemark(filter: { fields: { set: { eq: $name } } }) {
      nodes {
        id
        frontmatter {
          title
          date
          relativeDate: date(fromNow: true)
        }
        fields {
          slug
        }
      }
    }
    imagesFile: allSetImages(filter: { name: { eq: $name } }) {
      nodes {
        children {
          ... on ImageSharp {
            parent {
              ... on File {
                name
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
    }
  }
`;

const mergeImageFilesAndMeta = (
  files: ImageFileNode[],
  meta: ImageMetaNode[]
): ImageNode[] =>
  meta.map((image) => {
    const fileSlug = image.fields.slug
      .split('/')
      .filter(Boolean)
      .pop();
    const file = files.find(({ parent }) => parent.name === fileSlug);

    return {
      id: image.id,
      slug: image.fields.slug,
      title: image.frontmatter.title,
      date: image.frontmatter.date,
      relativeDate: image.frontmatter.relativeDate,
      src: { ...file.fluid, width: file.original.width },
    };
  });

const Set: React.SFC<Props> = ({ data }) => (
  <Layout>
    <Seo
      title={data.content.frontmatter.title}
      description={data.content.frontmatter.title}
    />
    <h1>{data.content.frontmatter.title}</h1>
    <time dateTime={data.content.frontmatter.date} className={styles.pubdate}>
      {data.content.frontmatter.relativeDate}
    </time>
    <Text className={styles.description} content={data.content.html} />
    <BackButton destination="/" />
    {mergeImageFilesAndMeta(
      data.imagesFile.nodes[0].children,
      data.imagesMeta.nodes
    ).map(({ id, slug, title, date, relativeDate, src }) => (
      <Photo
        key={id}
        slug={slug}
        src={src}
        title={title}
        date={date}
        relativeDate={relativeDate}
      />
    ))}
    <BackButton destination="/" />
  </Layout>
);

export default Set;
