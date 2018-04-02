const withTypescript = require('@zeit/next-typescript');
const { DefinePlugin } = require('webpack');
const { getPathMap } = require('phox');

const assetPrefix =
  process.env.NODE_ENV !== 'production'
    ? '/'
    : 'https://signaller-eagle-20543.netlify.com/';

const exportPathMap = async () => {
  const pathMap = await getPathMap();
  return {
    ...pathMap,
    ...{ '/404': { page: '_error' } },
  };
};

const webpack = (config, { dev }) => {
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
