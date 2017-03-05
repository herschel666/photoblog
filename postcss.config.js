
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const prodPlugins = isProd ? [cssnano] : [];

module.exports = {
    plugins: [autoprefixer].concat(prodPlugins),
};
