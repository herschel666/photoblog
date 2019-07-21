const localServerUrl = 'http://localhost:8000';

const subdomainPrefix = process.env.REVIEW_ID
  ? `deploy-preview-${process.env.REVIEW_ID}--`
  : '';

const assetPrefix =
  process.env.NODE_ENV !== 'production'
    ? localServerUrl
    : `https://${subdomainPrefix}signaller-eagle-20543.netlify.com/`;

module.exports = {
  assetPrefix,
  siteMetadata: {
    title: `ek|photos`,
    description: 'The cyberspace online photo album of Emanuel Kluge.',
    author: `@Herschel_R`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/_pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `sets`,
        path: `${__dirname}/_sets`,
        ignore: [`**/*.jpg`, /.+\/(?!index)([a-z0-9-]+).md$/],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/_sets`,
        ignore: [`**/*.jpg`, '**/index.md'],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `imageFiles`,
        path: `${__dirname}/_sets`,
        ignore: [`**/*.md`],
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-manifest`,
    //   options: {
    //     name: `gatsby-starter-default`,
    //     short_name: `starter`,
    //     start_url: `/`,
    //     background_color: `#663399`,
    //     theme_color: `#663399`,
    //     display: `minimal-ui`,
    //     icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
    //   },
    // },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
  ],
};
