[photos.klg.bz](https://photos.klg.bz/)
====

> Presenting my photos without having to rely on f***ing Flickr.

This photoblog is powered by [Webpack](https://webpack.js.org/) and the [Static-Site-Generator-Webpack-Plugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin). The content is saved in Markdown files and the photos itself. The static views are rendered from [React](https://facebook.github.io/react/)-components. On the client-side I use [RxJS5](https://github.com/ReactiveX/rxjs) to tame the code and [Turbolinks](https://github.com/turbolinks/turbolinks) to speed up the site.

If you have any questions, [ping me on twitter](https://twitter.com/Herschel_R).

## Installation

```bash
# Activate the correct node-version
$ nvm use

# Install the node dependencies
$ npm install
```

## Developing

```bash
# Run the watch task
$ npm run watch

# Lint the codebase
$ npm run lint

# Build into ./dist-folder
$ npm run build
```
