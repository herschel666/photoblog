const { DefinePlugin } = require('webpack');
const { getPathMap } = require('phox');

const cdnUrl = (exports.assetPrefix =
  process.env.NODE_ENV !== 'production'
    ? '/'
    : 'https://signaller-eagle-20543.netlify.com/');

exports.exportPathMap = async () => {
  const pathMap = await getPathMap();
  return {
    ...pathMap,
    ...{ '/404': { page: '_error' } },
  };
};

exports.webpack = (config, { dev }) => {
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
      CDN_URL: JSON.stringify(cdnUrl),
    })
  );
  return config;
};
