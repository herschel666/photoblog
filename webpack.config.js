
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const getImageData = require('./lib/get-image-data');

const PAGES_PATH = path.join(__dirname, 'pages');
const SRC_PATH = path.join(__dirname, 'src');
const LIB_PATH = path.join(__dirname, 'lib');
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
const srcsetLoader = {
    loader: 'srcset-loader',
    query: {
        sizes: ['250w', '500w', '750w', '1000w'],
        placeholder: 8,
    },
};

const pages = glob.sync(path.join(PAGES_PATH, '**/index.md'))
    .map(album => album.replace(PAGES_PATH, '').replace('index.md', ''));
const sets = pages
    .filter(page => page.includes('/sets/'))
    .reduce((acc, set) => Object.assign({}, acc, {
        [set]: glob.sync(path.join(PAGES_PATH, set, '*.jpg'))
            .map(photo => path.basename(photo)),
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
        __dirname: JSON.stringify(__dirname),
    }),
    new ExtractTextPlugin({
        filename: 'styles.[hash].css',
        allChunks: true,
    }),
    getImageData,
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

    entry: {
        main: path.resolve(LIB_PATH, 'index.js'),
        scripts: path.resolve(SRC_PATH, 'scripts', 'main.js'),
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
            include: SRC_PATH,
            use: ['source-map-loader'],
            enforce: 'pre',
        }, {
            test: /\.jsx?$/,
            exclude: /(node_modules|pages)/,
            use: ['babel-loader'],
        }, {
            test: /(views|container|components)\/.*\.sass$/,
            include: SRC_PATH,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: styleLoaders,
            }),
        }, {
            test: /(styles)\/.*\.sass$/,
            include: SRC_PATH,
            use: styleLoaders,
        }, {
            test: /\.css$/,
            include: /node_modules\/leaflet/,
            use: ['style-loader', {
                loader: 'css-loader',
                query: {
                    minimize: true,
                    root: '/',
                },
            }],
        }, {
            test: /\.ejs$/,
            include: SRC_PATH,
            use: ['ejs-loader'],
        }, {
            test: /\.(png|gif|ico)$/,
            use: [fileLoader],
        }, {
            test: /\.jpg$/,
            include: path.join(PAGES_PATH, 'sets'),
            use: [srcsetLoader, fileLoader],
        }, {
            test: /\.markup\.svg$/,
            include: SRC_PATH,
            use: ['html-loader', 'markup-inline-loader'],
        }, {
            test: /\.file\.svg$/,
            include: SRC_PATH,
            use: [urlLoader],
        }, {
            test: /index\.md$/,
            include: PAGES_PATH,
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
