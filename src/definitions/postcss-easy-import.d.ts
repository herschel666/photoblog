declare module 'postcss-easy-import' {
  import * as postcss from 'postcss';

  interface Options {
    prefix: 'string';
  }

  interface Transformer extends postcss.Transformer {
    info(): string;
  }

  interface PostCssEasyImport extends postcss.Plugin<Options> {
    (opts?: Options): Transformer;
  }

  const postCssEasyImport: PostCssEasyImport;
  export = postCssEasyImport;
}
