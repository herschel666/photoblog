
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

const getSetList = sets => Object.keys(sets)
    .map(set => Object.assign({ path: set }, require(`./pages${set}index.md`)))
    .map(({ path, attributes }) => ({ title: attributes.title, path }));

const SetView = (title, content, locals) => {
    const photos = locals.images
        .map(({ file, exif }) => ({
            meta: getMetaFromIptc(exif.iptc),
            file,
        }));
    return renderToStaticMarkup(createElement(Set, { title, content, photos }));
};

const PhotoView = photo =>
    renderToStaticMarkup(createElement(Photo, { photo }));

const Frontview = (_, content, { sets }) =>
    renderToStaticMarkup(createElement(Front, {
        list: getSetList(sets),
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

const getImageDataBySearch = (entryModule, search) =>
    eval(entryModule.dependencies.find(({ request }) =>
        request.includes(search)).module._source._value);

const getAllImagesFromChunks = chunks => chunks
    .filter(({ name }) => name.endsWith('.jpg'))
    .reduce((acc, { entryModule, name }) => Object.assign({}, acc, {
        [name]: {
            exif: getImageDataBySearch(entryModule, 'exif=true'),
            file: getImageDataBySearch(entryModule, 'file=true'),
        },
    }), {});

const getCurrentImages = (images, set = []) => set
    .map(photo => images[photo]);

const appendDetailPagesForAlbum = (tmplDefaults, images, compiler) => {
    /* eslint "no-underscore-dangle": 0, "no-eval": 0 */
    if (!images.length) {
        return;
    }
    compiler.plugin('emit', ({ assets }, done) => {
        Object.assign(assets, images.reduce((acc, { exif, file }) => {
            const fileName = `photo${file.replace('.jpg', '')}/index.html`;
            const meta = getMetaFromIptc(exif.iptc);
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
    const { compilation } = locals.webpackStats;
    const { body, attributes } = require(`./pages${locals.path}index.md`);
    const { title, view = 'Default' } = attributes;
    const styles = Object.keys(compilation.assets)
        .find(x => x.endsWith('.css'));
    const images = getAllImagesFromChunks(compilation.chunks);
    const currentImages = getCurrentImages(images, locals.sets[locals.path]);
    const tmplDefaults = {
        styles,
    };

    appendDetailPagesForAlbum(tmplDefaults, currentImages, compilation.compiler);

    const content = marked(body.trim());
    const html = views[view](title, content, { ...locals, ...{ images: currentImages } });
    return callback(null, template({ title, html, ...tmplDefaults }));
}
