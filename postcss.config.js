const postCssEasyImport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProd = process.env.NODE_ENV === 'production';

const prefix = '_';

const browsers = ['last 3 versions'];

exports.plugins = [
  postCssEasyImport({ prefix }),
  autoprefixer({ browsers }),
  isProd && cssnano({ preset: 'default' }),
].filter(Boolean);
