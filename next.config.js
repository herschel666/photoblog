const withTypescript = require('@zeit/next-typescript');
const { DefinePlugin } = require('webpack');
const { getPathMap } = require('phox');
const { port } = require('./phox.config');

const localServerUrl = `http://localhost:${port}/`;

const subdomainPrefix = process.env.REVIEW_ID
  ? `deploy-preview-${process.env.REVIEW_ID}--`
  : '';

const assetPrefix =
  process.env.NODE_ENV !== 'production'
    ? localServerUrl
    : `https://${subdomainPrefix}signaller-eagle-20543.netlify.com/`;

const exportPathMap = async () => {
  const pathMap = await getPathMap();
  return {
    ...pathMap,
    ...{ '/404': { page: '_error' } },
  };
};

const webpack = (config) => {
  const { rules } = config.module;
  config.module = {
    ...config.module,
    rules: rules.concat(
      {
        test: /\.css/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader'],
      }
    ),
  };
  config.plugins.push(
    new DefinePlugin({
      LOCAL_SERVER_URL: JSON.stringify(localServerUrl),
      CDN_URL: JSON.stringify(assetPrefix),
    })
  );
  return config;
};

module.exports = withTypescript({
  assetPrefix,
  exportPathMap,
  webpack,
});
