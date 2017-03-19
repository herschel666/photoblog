
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

const PAGES_PATH = path.join(__dirname, 'pages');
const DIST_PATH = path.join(__dirname, 'dist');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const bail = isProd;
const cssClassHash = '[hash:base64:5]';
const localIdentName = isProd ? cssClassHash : `[local]___${cssClassHash}`;
const cssLoader = {
    loader: 'css-loader',
    query: {
        modules: true,
        importLoaders: 1,
        localIdentName,
    },
};
const sassLoader = {
    loader: 'sass-loader',
    options: {
        indentedSyntax: true,
        outputStyle: 'compressed',
    },
};
const styleLoaders = [
    cssLoader,
    'postcss-loader',
    sassLoader,
];
const fileLoader = {
    loader: 'file-loader',
    options: {
        publicPath: '/',
        name: '[sha512:hash:base64:7].[ext]',
    },
};
const urlLoader = Object.assign({}, fileLoader, {
    loader: 'url-loader',
});

const pages = glob.sync(path.join(PAGES_PATH, '**/index.md'))
    .map(album => album.replace(PAGES_PATH, '').replace('index.md', ''));
const photosByPage = pages
    .filter(page => page.includes('/sets/'))
    .reduce((acc, set) => acc.concat([{
        images: glob.sync(path.join(PAGES_PATH, set, '*.jpg'))
            .map(photo => `.${photo.replace(__dirname, '')}`)
            .reduce((innerAcc, photo) => Object.assign({
                [path.basename(photo)]: [
                    `${photo}?exif=true`,
                    `${photo}?sizes=600w+1200w`,
                ],
            }, innerAcc), {}),
        path: set,
    }]), []);
const sets = photosByPage
    .reduce((acc, photo) =>
        Object.assign({}, acc, {
            [photo.path]: Object.keys(photo.images),
        }), {});

const plugins = [
    new StaticSiteGeneratorPlugin({
        entry: 'main',
        locals: { sets },
        paths: pages,
    }),
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
        __DEV__: !isProd,
        __PROD__: isProd,
    }),
    new ExtractTextPlugin({
        filename: 'styles.[hash].css',
        allChunks: true,
    }),
];
const prodPlugins = !isProd ? [] : [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
        },
        output: {
            comments: false,
        },
    }),
];

module.exports = {

    target: 'async-node',

    entry: {
        main: path.resolve(__dirname, 'index.js'),
    },

    output: {
        path: DIST_PATH,
        publicPath: '/',
        libraryTarget: 'umd',
        filename: '[name].[hash].js',
    },

    module: {
        noParse: [/fsevents/],
        rules: [{
            test: /\.js$/,
            use: ['source-map-loader'],
            exclude: /node_modules/,
        }, {
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: /node_modules/,
        }, {
            test: /(views|container|components)\/.*\.sass$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: styleLoaders,
            }),
        }, {
            test: /(styles)\/.*\.sass$/,
            use: styleLoaders,
        }, {
            test: /\.ejs$/,
            use: ['ejs-loader'],
        }, {
            test: /\.(png|gif)$/,
            use: [fileLoader],
        }, {
            test: /\.markup\.svg$/,
            use: ['html-loader', 'markup-inline-loader'],
        }, {
            test: /\.file\.svg$/,
            use: [urlLoader],
        }, {
            test: /index\.md$/,
            use: ['json-loader', 'front-matter-loader'],
        }],
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },

    devServer: {
        contentBase: DIST_PATH,
        clientLogLevel: 'error',
        historyApiFallback: true,
        port: 8091,
        stats: { colors: true },
    },

    devtool: 'source-map',

    plugins: plugins.concat(prodPlugins),

    bail,

};
