import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

type TwitterCard = 'summary' | 'summary_large_image';
type OpenGraphType = 'website' | 'article';

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
  openGraphType?: OpenGraphType;
  twitterCard?: TwitterCard;
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
    revised: string;
    meta: SiteMetadata;
  };
}

const Seo: React.SFC<Props> = ({
  description = '',
  lang = 'en',
  openGraphType = 'website',
  twitterCard = 'summary',
  meta,
  title,
}) => {
  const { site } = useStaticQuery<QueryResult>(
    graphql`
      query {
        site {
          revised: buildTime(formatString: "DD/MM/YYYY HH:mm")
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
          rel: 'shortcut icon',
          href: '/favicon.ico',
        },
        {
          rel: 'webmention',
          href: 'https://webmention.io/photos.klg.bz/webmention',
        },
        { rel: 'pingback', href: 'https://webmention.io/photos.klg.bz/xmlrpc' },
      ]}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          name: 'revised',
          content: site.revised,
        },
        {
          property: 'og:site_name',
          content: site.meta.title,
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
          content: openGraphType,
        },
        {
          name: 'twitter:site',
          content: site.meta.title,
        },
        {
          name: 'twitter:card',
          content: twitterCard,
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
        {
          name: 'theme-color',
          content: '#000000',
        },
      ].concat(meta || [])}
    />
  );
};

export default Seo;
