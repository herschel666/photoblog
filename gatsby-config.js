require('dotenv-load')();

module.exports = {
  assetPrefix: 'https://ek-photos-cdn.netlify.com/',
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
            'Access-Control-Allow-Credentials: true',
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
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        environment: process.env.CONTENTFUL_ENVIRONMENT,
        localeFilter: (locale) => locale.code === 'en-US',
        downloadLocal: true,
      },
    },
  ],
};
