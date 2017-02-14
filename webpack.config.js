
const path = require('path');
const glob = require('glob');
const { jsdom } = require('jsdom');
const webpack = require('webpack');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

const ALBUMS_PATH = path.join(__dirname, 'albums');
const SRC_PATH = path.join(__dirname, 'src');
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

const scope = { window: jsdom().defaultView };
const albums = glob.sync(path.join(ALBUMS_PATH, '**/index.md'))
    .map(album => album.replace(ALBUMS_PATH, '').replace('index.md', ''));
const photosByAlbum = albums
    .reduce((all, album) => Object.assign({}, all, {
        [album]: glob
            .sync(path.join(ALBUMS_PATH, album, '*.jpg'))
            .map(photo => `.${photo.replace(__dirname, '')}`)
            .reduce((acc, photo) => Object.assign({}, acc, {
                [path.basename(photo)]: photo,
            }), {}),
    }), {});
const photos = Object.keys(photosByAlbum)
    .reduce((acc, album) => Object.assign({}, acc, photosByAlbum[album]), {});

const plugins = [
    new StaticSiteGeneratorPlugin('main', albums, { photos: photosByAlbum }, scope),
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
        __DEV__: !isProd,
        __PROD__: isProd,
    }),
    new webpack.LoaderOptionsPlugin({
        test: /\.(png|jpe?g|gif)$/,
        options: {
            fileLoader: {
                name: '[sha512:hash:base64:7].[ext]',
            },
        },
    }),
    new webpack.LoaderOptionsPlugin({
        test: /\.svg$/,
        options: {
            urlLoader: {
                name: '[sha512:hash:base64:7].[ext]',
                limit: 1024 * 10,
            },
        },
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

    entry: Object.assign(photos, {
        main: path.resolve(__dirname, 'index.js'),
    }),

    output: {
        path: DIST_PATH,
        publicPath: '/',
        libraryTarget: 'umd',
        filename: '[name].[hash].js',
    },

    module: {
        noParse: [/react/, /react-dom/],
        rules: [{
            test: /\.js$/,
            use: ['source-map-loader'],
            exclude: /node_modules/,
        }, {
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: [/node_modules/],
        }, {
            test: /\.s(a|c)ss$/,
            use: [
                'style-loader',
                cssLoader,
                'postcss-loader',
                'sassLoader',
            ],
        }, {
            test: /\.ejs$/,
            use: ['ejs-loader'],
        }, {
            test: /\.jpg$/,
            use: ['exif-loader', 'file-loader'],
        }, {
            test: /\.(png|gif)$/,
            use: ['file-loader'],
        }, {
            test: /\.markup\.svg$/,
            use: ['html-loader', 'markup-inline-loader'],
        }, {
            test: /\.file\.svg$/,
            use: ['url-loader'],
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
        inline: true,
        clientLogLevel: 'error',
        historyApiFallback: true,
        port: 8091,
        stats: { colors: true },
    },

    devtool: 'source-map',

    plugins: plugins.concat(prodPlugins),

    bail,

};
