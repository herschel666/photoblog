const subdomainPrefix = process.env.REVIEW_ID
  ? `deploy-preview-${process.env.REVIEW_ID}--`
  : '';

const assetPrefix = `https://${subdomainPrefix}ek-photos-cdn.netlify.com/`;

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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        headers: {
          '/*': [
            'Access-Control-Allow-Methods: GET, OPTIONS',
            'Access-Control-Allow-Origin: https://photos.klg.bz',
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
  ],
};
