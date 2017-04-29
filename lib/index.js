
/* eslint
    "import/no-dynamic-require": 0,
    "global-require": 0 */

import nodePath from 'path';
import marked from 'marked';
import slug from 'slug';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import template from '../src/template.ejs';
import Set from '../src/views/set/set';
import Photo from '../src/views/photo/photo';
import Front from '../src/views/front/front';
import Default from '../src/views/default/default';
import favicon from '../src/images/favicon.ico';

const getPublishedTime = (date) => {
    try {
        return (new Date(date)).getTime();
    } catch (e) {
        return Date.now();
    }
};

const getSetList = sets => Object.keys(sets)
    .map(set => Object.assign({ path: set }, require(`../pages${set}index.md`)))
    .map(({ path, attributes }) => ({
        title: attributes.title,
        published: getPublishedTime(attributes.published),
        path,
    }));

const SetView = (title, content, locals, metadata) => {
    const photos = locals.images
        .map(({ srcSet, placeholder, src, image }) => ({
            meta: metadata[`${image}.jpg`],
            placeholder,
            image,
            srcSet,
            src,
        }));
    const published = new Date(locals.published);
    return renderToStaticMarkup(createElement(Set, { title, published, content, photos }));
};

const PhotoView = (photo, setPath, nav) =>
    renderToStaticMarkup(createElement(Photo, { photo, setPath, nav }));

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

const getCurrentImages = (sets, currentPath) => (sets[currentPath] || [])
    .map(photo => `${currentPath}${photo}`)
    .map((photo) => {
        const imageName = photo.replace('.jpg', '');
        const srcSet = require(`srcset-loader?sizes=250w+500w+750w+1000w&placeholder=8!file-loader?publicPath=/&name=[sha512:hash:base64:7].[ext]!../pages${imageName}.jpg`);
        const src = srcSet.sources['250w'];
        try {
            return Object.assign(srcSet, {
                image: nodePath.basename(photo, '.jpg'),
                src,
            });
        } catch (err) {
            return {};
        }
    });

const getDetailPath = (setName, imageName) =>
    `photo/${slug(setName.toLowerCase())}-${imageName}/`;

const getDetailPathByImage = (metadata, { image } = {}) => {
    if (!image) {
        return null;
    }
    const { title } = metadata[`${image}.jpg`];
    return `/${getDetailPath(title, image)}`;
};

const getPrevNextLinks = (images, metadata, index) => {
    const prevImage = images[index - 1];
    const nextImage = images[index + 1];
    const prev = getDetailPathByImage(metadata, prevImage);
    const next = getDetailPathByImage(metadata, nextImage);
    return { prev, next };
};

const appendDetailPagesForAlbum = (tmplDefaults, images, compiler, setPath) => {
    compiler.plugin('emit', ({ assets, metadata }, done) => {
        Object.assign(assets, images.reduce((acc, img, index) => {
            const { srcSet, placeholder, src, image } = img;
            const meta = metadata[`${image}.jpg`];
            const title = `🖼 '${meta.title}'`;
            const fileName = `${getDetailPath(meta.title, image)}index.html`;
            const nav = getPrevNextLinks(images, metadata, index);
            const props = { meta, srcSet, placeholder, src };
            const html = views.Photo(props, setPath, nav);
            const content = template({
                title,
                html,
                image: srcSet.split(',').pop().split(' ').shift(),
                ...tmplDefaults,
            });
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

const getPosterImage = (setPath, imageName) => {
    if (!imageName) {
        return null;
    }
    return require(`file-loader?publicPath=/&name=[sha512:hash:base64:7].[ext]!../pages${setPath}${imageName}.jpg`);
};

export default function (locals, callback) {
    const { compilation } = locals.webpackStats;
    const { body, attributes } = require(`../pages${locals.path}index.md`);
    const { title, poster = '', view = 'Default', published = '1970-01-01' } = attributes;
    const styles = Object.keys(compilation.assets)
        .find(x => x.endsWith('.css'));
    const currentImages = getCurrentImages(locals.sets, locals.path);
    const js = Object.keys(compilation.assets)
        .find(x => x.includes('scripts.') && x.endsWith('.js'));
    const tmplDefaults = { styles, js, favicon };

    if (currentImages.length) {
        appendDetailPagesForAlbum(tmplDefaults, currentImages,
            compilation.compiler, locals.path);
    }

    const content = `<div class="main-content">${marked(body.trim())}</div>`;
    const html = views[view](title, content, Object.assign({}, locals, {
        images: currentImages,
        published,
    }), compilation.metadata);
    const image = getPosterImage(locals.path, nodePath.basename(poster, '.jpg'));
    return callback(null, template({ title, image, html, ...tmplDefaults }));
}