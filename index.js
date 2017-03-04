
/* eslint
    "import/no-dynamic-require": 0,
    "global-require": 0 */

import marked from 'marked';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import shuffle from 'shuffle-array';
import template from './src/template.ejs';
import Album from './src/views/album/album';
import Detail from './src/views/detail/detail';
import Front from './src/views/front/front';
import Default from './src/views/default/default';

const getRandomPhoto = (photos) => {
    const collection = Object.keys(photos)
        .reduce((acc, album) =>
            acc.concat(Object.keys(photos[album])
                .map(photo => require(`./albums${album}${photo}`))), []);
    return shuffle(collection).shift();
};

const getAlbumListFromPhotos = photos => Object.keys(photos)
    .filter(album => Object.keys(photos[album]).length > 0)
    .map(album => Object.assign({ path: album }, require(`./albums${album}index.md`)))
    .map(({ path, attributes }) => ({ title: attributes.title, path }));

const AlbumView = (title, content, locals) => {
    const photos = Object.keys(locals.photos[locals.path])
        .map(photo => require(`./albums${locals.path}${photo}`));
    return renderToStaticMarkup(createElement(Album, { title, content, photos }));
};

const DetailView = (title, image) =>
    renderToStaticMarkup(createElement(Detail, { title, image }));

const Frontview = (_, content, { photos }) =>
    renderToStaticMarkup(createElement(Front, {
        photo: getRandomPhoto(photos),
        list: getAlbumListFromPhotos(photos),
        content,
    }));

const DefaultView = (title, content) =>
    renderToStaticMarkup(createElement(Default, { title, content }));

const views = {
    Album: AlbumView,
    Detail: DetailView,
    Front: Frontview,
    Default: DefaultView,
};

const appendDetailPagesForAlbum = (view, path, compilation) => {
    /* eslint "no-underscore-dangle": 0, "no-eval": 0 */
    if (view !== 'Album') {
        return;
    }
    const allImages = compilation.chunks
        .filter(({ name }) => name.endsWith('.jpg'))
        .reduce((acc, { entryModule }) => Object.assign({}, acc, {
            [entryModule._source._name.split('/').pop()]: eval(entryModule._source._value),
        }), {});

    compilation.compiler.plugin('emit', ({ chunks, assets }, done) => {
        const images = chunks.filter(c =>
            c.entryModule.context.includes(path.replace(/^\/|\/$/g, '')));
        Object.assign(assets, images.reduce((acc, { name }) => {
            const fileName = `detail${allImages[name].file.replace('.jpg', '')}/index.html`;
            const title = 'Detail view'; // TODO use title from IPTC data
            const html = views.Detail(title, allImages[name].file);
            const content = template({ title, html });
            return Object.assign({}, acc, {
                [fileName]: {
                    source: () => content,
                    size: () => content.length,
                },
            });
        }, {}));
        done();
    });
};

export default function (locals, callback) {
    const { body, attributes } = require(`./albums${locals.path}index.md`);
    const { title, view = 'Default' } = attributes;

    appendDetailPagesForAlbum(view, locals.path, locals.webpackStats.compilation);

    const content = marked(body.trim());
    const html = views[view](title, content, locals);
    return callback(null, template({ title, html }));
}
