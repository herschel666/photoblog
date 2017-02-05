
/* eslint "no-console": 0 */

const { readFile } = require('fs');
const path = require('path');
const next = require('next');
const { serveStatic } = require('next/dist/server/render');
const hapi = require('hapi');
const writeData = require('./write-data');
const { pathWrapper, defaultHandlerWrapper } = require('./next-wrapper');
const { NEXT } = require('./config');

const ALBUMS = path.join(NEXT, 'albums.json');

const dev = process.env.NODE_ENV !== 'production';

const serveAlbumData = ({ params }, reply) =>
    readFile(ALBUMS, 'utf8', (err, data) => {
        if (!params.album) {
            return reply(data);
        }
        const albums = JSON.parse(data.trim());
        const album = albums.find(x => x.slug === params.album) || {};
        return reply(album);
    });

const serveImage = ({ raw, params }, reply) => {
    const { album, image } = params;
    const imgPath = path.join(process.cwd(), 'albums', album, image);
    return serveStatic(raw.req, raw.res, imgPath).then(reply);
};

module.exports = () => {
    const app = next({ dev });
    const server = new hapi.Server();

    return app.prepare().then(writeData).then(() => {
        server.connection({ port: 3000 });

        server.route({
            method: 'GET',
            path: '/',
            handler: pathWrapper(app, '/'),
        });

        server.route({
            method: 'GET',
            path: '/album/{album}',
            handler: pathWrapper(app, '/album'),
        });

        server.route({
            method: 'GET',
            path: '/img/{album}/{image}',
            handler: serveImage,
        });

        server.route({
            method: 'GET',
            path: '/api/v1/albums/{album?}',
            handler: serveAlbumData,
        });

        server.route({
            method: 'GET',
            path: '/{p*}', /* catch all route */
            handler: defaultHandlerWrapper(app),
        });

        server.start().catch((error) => {
            console.log('Error starting server');
            console.log(error);
        }).then(() => console.log('> Ready on http://localhost:3000'));
    }).catch(console.error);
};
