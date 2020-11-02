const { join: pathJoin } = require('path');
const fg = require('fast-glob');

require('dotenv-load')();

const isProd = process.env.TARGET === 'production';
const siteUrl = isProd ? 'https://photos.klg.bz' : 'http://localhost:8000';
const siteTitle = 'ek|photos';

const getContentEncoded = (html, src) => ({
  'content:encoded': `<![CDATA[${html}
    <p><img alt=""
      border="0"
      src="${src}"
      width="1000" />]></p>`,
});

const setsToIgnore = isProd
  ? []
  : fg
      .sync(`_sets/*`, { onlyDirectories: true })
      .filter((set) => !set.includes('hamburg'))
      .map((s) => new RegExp(`${s.replace('_sets/', '')}.*`));

module.exports = {
  assetPrefix: 'https://ek-photos-cdn.netlify.app/',
  siteMetadata: {
    title: siteTitle,
    description: 'The cyberspace online photo album of Emanuel Kluge.',
    author: `@Herschel_R`,
    siteUrl,
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
        ignore: [`**/*.jpg`, /.+\/(?!index)([a-z0-9-]+).md$/, ...setsToIgnore],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/_sets`,
        ignore: [`**/*.jpg`, '**/index.md', ...setsToIgnore],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `imageFiles`,
        path: `${__dirname}/_sets`,
        ignore: [`**/*.md`, ...setsToIgnore],
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
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(
          pathJoin(__dirname, 'src', 'components', 'page.tsx')
        ),
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
    'gatsby-plugin-webpack-size',
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: edge.node.id,
                  custom_elements: [
                    getContentEncoded(
                      edge.node.html,
                      edge.node.frontmatter.poster.image.fixed.src
                    ),
                  ],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  filter: { fields: { type: { eq: "sets" } } }
                  sort: { fields: [frontmatter___date], order: DESC }
                ) {
                  edges {
                    node {
                      id
                      html
                      excerpt
                      fields { slug }
                      frontmatter {
                        title
                        date
                        poster {
                          image: childImageSharp {
                            fixed(width: 1000) { src }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: '/sets.xml',
            title: `${siteTitle} · Sets`,
          },
          {
            serialize: ({ query: { site, insta } }) =>
              insta.images.map((image) => ({
                title: image.title,
                description: image.description.markdown.excerpt,
                date: image.date,
                url: `${site.siteMetadata.siteUrl}/insta/${image.id}`,
                guid: image.id,
                custom_elements: [
                  getContentEncoded(
                    image.description.markdown.html,
                    image.file.local.img.fixed.src
                  ),
                ],
              })),
            query: `
              {
                insta: allContentfulImage(sort: {fields: [date], order: DESC}, limit: 10) {
                  images: nodes {
                    id: contentful_id
                    title
                    date
                    description {
                      markdown: childMarkdownRemark {
                        html
                        excerpt
                      }
                    }
                    file {
                      local: localFile {
                        img: childImageSharp {
                          fixed(width: 1000, height: 1000, fit: CONTAIN) {
                            src
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: '/insta.xml',
            title: `${siteTitle} · Insta`,
          },
        ],
      },
    },
  ],
};
