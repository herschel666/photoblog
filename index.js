
/* eslint
    "import/no-dynamic-require": 0,
    "global-require": 0 */

import marked from 'marked';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import template from './src/template.ejs';
import Set from './src/views/set/set';
import Photo from './src/views/photo/photo';
import Front from './src/views/front/front';
import Default from './src/views/default/default';

const getCreationDateFromString = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6);
    return new Date(`${year}-${month}-${day}`);
};

const getMetaFromIptc = ({ object_name, date_created }) => ({
    title: object_name,
    createdAt: getCreationDateFromString(date_created),
});

const getSetListFromPhotos = photos => Object.keys(photos)
    .filter(set => Object.keys(photos[set]).length > 0)
    .map(set => Object.assign({ path: set }, require(`./pages${set}index.md`)))
    .map(({ path, attributes }) => ({ title: attributes.title, path }));

const SetView = (title, content, locals) => {
    const photos = Object.keys(locals.photos[locals.path])
        .map(photo => require(`./pages${locals.path}${photo}`))
        .map(({ file, iptc }) => ({
            meta: getMetaFromIptc(iptc),
            file,
        }));
    return renderToStaticMarkup(createElement(Set, { title, content, photos }));
};

const PhotoView = photo =>
    renderToStaticMarkup(createElement(Photo, { photo }));

const Frontview = (_, content, { photos }) =>
    renderToStaticMarkup(createElement(Front, {
        list: getSetListFromPhotos(photos),
        content,
    }));

const DefaultView = (title, content) =>
    renderToStaticMarkup(createElement(Default, { title, content }));

const views = {
    Set: SetView,
    Photo: PhotoView,
    Front: Frontview,
    Default: DefaultView,
};

const appendDetailPagesForAlbum = (tmplDefaults, view, path, compilation) => {
    /* eslint "no-underscore-dangle": 0, "no-eval": 0 */
    if (view !== 'Set') {
        return;
    }
    const allImages = compilation.chunks
        .filter(({ name }) => name.endsWith('.jpg'))
        .reduce((acc, { entryModule }) => Object.assign({}, acc, {
            [entryModule._source._name.split('/').pop()]: eval(entryModule._source._value),
        }), {});

    compilation.compiler.plugin('emit', ({ chunks, assets }, done) => {
        const album = path.replace(/^\/|\/$/g, '');
        const images = chunks.filter(({ entryModule }) =>
            entryModule.context.includes(album));
        Object.assign(assets, images.reduce((acc, { name }) => {
            const { file, iptc } = allImages[name];
            const fileName = `photo${file.replace('.jpg', '')}/index.html`;
            const meta = getMetaFromIptc(iptc);
            const title = `🖼 "${meta.title}"`;
            const html = views.Photo({ meta, file });
            const content = template({ title, html, ...tmplDefaults });
            const source = {
                source: () => content,
                size: () => content.length,
            };
            return Object.assign({}, acc, {
                [fileName]: source,
            });
        }, {}));
        done();
    });
};

export default function (locals, callback) {
    const { body, attributes } = require(`./pages${locals.path}index.md`);
    const { title, view = 'Default' } = attributes;
    const styles = Object.keys(locals.webpackStats.compilation.assets)
        .find(x => x.endsWith('.css'));
    const tmplDefaults = {
        styles,
    };

    appendDetailPagesForAlbum(tmplDefaults, view, locals.path, locals.webpackStats.compilation);

    const content = marked(body.trim());
    const html = views[view](title, content, locals);
    return callback(null, template({ title, html, ...tmplDefaults }));
}
