const postCssEasyImport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');

const prefix = '_';

const browsers = ['last 3 versions'];

exports.plugins = [postCssEasyImport({ prefix }), autoprefixer({ browsers })];
