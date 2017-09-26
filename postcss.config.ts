import * as postCssEasyImport from 'postcss-easy-import';
import * as autoprefixer from 'autoprefixer';

const prefix = '_';

const browsers = ['last 3 versions'];

export const plugins = [
  postCssEasyImport({ prefix } as any),
  autoprefixer({ browsers }),
];
