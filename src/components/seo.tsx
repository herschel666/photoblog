import React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

type Meta =
  | {
      name: string;
      content: string;
    }
  | {
      property: string;
      content: string;
    };

interface Props {
  description?: string;
  lang?: string;
  meta?: Meta[];
  title: string;
}

interface SiteMetadata {
  title: string;
  description: string;
  author: string;
}

interface QueryResult {
  site: {
    assetPrefix: string;
    meta: SiteMetadata;
  };
}

const Seo: React.SFC<Props> = ({
  description = '',
  lang = 'en',
  meta,
  title,
}) => {
  const { site } = useStaticQuery<QueryResult>(
    graphql`
      query {
        site {
          assetPrefix
          meta: siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaDescription = description || site.meta.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s · ${site.meta.title}`}
      link={[
        {
          rel: 'preconnect',
          href: site.assetPrefix,
        },
      ]}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: site.meta.author,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
      ].concat(meta || [])}
    />
  );
};

export default Seo;
