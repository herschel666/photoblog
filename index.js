
/* eslint
    "import/no-dynamic-require": 0,
    "global-require": 0 */

import nodePath from 'path';
import marked from 'marked';
import slug from 'slug';
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

const coordToDecimal = (gps) => {
    const latArr = gps.GPSLatitude;
    const lngArr = gps.GPSLongitude;
    if (!latArr || !lngArr) {
        return {};
    }
    const latRef = gps.GPSLatitudeRef || 'N';
    const lngRef = gps.GPSLongitudeRef || 'W';
    const lat = (latArr[0] + latArr[1] / 60 + latArr[2] / 3600) * (latRef === 'N' ? 1 : -1);
    const lng = (lngArr[0] + lngArr[1] / 60 + lngArr[2] / 3600) * (lngRef === 'W' ? -1 : 1);
    return { lat, lng };
};

const getDetailsFromMeta = (iptc, exif) => ({
    title: iptc.object_name,
    description: iptc.caption || '',
    createdAt: getCreationDateFromString(iptc.date_created),
    camera: exif.image.Model,
    lens: exif.exif.LensModel,
    iso: Number(exif.exif.ISO),
    aperture: exif.exif.FNumber.toFixed(1),
    focalLength: exif.exif.FocalLength.toFixed(1),
    exposureTime: Number(exif.exif.ExposureTime),
    flash: Boolean(exif.exif.Flash),
    gps: coordToDecimal(exif.gps),
});

const getPublishedTime = (date) => {
    try {
        return (new Date(date)).getTime();
    } catch (e) {
        return Date.now();
    }
};

const getSetList = sets => Object.keys(sets)
    .map(set => Object.assign({ path: set }, require(`./pages${set}index.md`)))
    .map(({ path, attributes }) => ({
        title: attributes.title,
        published: getPublishedTime(attributes.published),
        path,
    }));

const SetView = (title, content, locals) => {
    const photos = locals.images
        .map(({ srcSet, placeholder, src, iptc, exif, image }) => ({
            meta: getDetailsFromMeta(iptc, exif),
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
        const srcSet = require(`srcset-loader?sizes=250w+500w+750w+1000w&placeholder!file-loader?publicPath=/&name=[sha512:hash:base64:7].[ext]!./pages${imageName}.jpg`);
        const src = srcSet.sources['250w'];
        try {
            return Object.assign(
                require(`exif-loader!./pages${imageName}.jpg`),
                srcSet, { src, image: nodePath.basename(photo, '.jpg') });
        } catch (err) {
            return {};
        }
    });

const getDetailPath = (setName, imageName) =>
    `photo/${slug(setName.toLowerCase())}-${imageName}/`;

const getPrevNextLinks = (images, index) => {
    const prevImage = images[index - 1];
    const prevTitle = prevImage ? getDetailsFromMeta(prevImage.iptc, prevImage.exif).title : null;
    const prev = prevTitle ? `/${getDetailPath(prevTitle, prevImage.image)}` : null;
    const nextImage = images[index + 1];
    const nextTitle = nextImage ? getDetailsFromMeta(nextImage.iptc, nextImage.exif).title : null;
    const next = nextTitle ? `/${getDetailPath(nextTitle, nextImage.image)}` : null;
    return { prev, next };
};

const appendDetailPagesForAlbum = (tmplDefaults, images, compiler, setPath, js) => {
    compiler.plugin('emit', ({ assets }, done) => {
        Object.assign(assets, images.reduce((acc, img, index) => {
            const { iptc, exif, srcSet, placeholder, src, image } = img;
            const meta = getDetailsFromMeta(iptc, exif);
            const title = `🖼 "${meta.title}"`;
            const fileName = `${getDetailPath(meta.title, image)}index.html`;
            const nav = getPrevNextLinks(images, index);
            const html = views.Photo({ meta, srcSet, placeholder, src }, setPath, nav);
            const content = template({ title, html, js, ...tmplDefaults });
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
    const { title, view = 'Default', published = '1970-01-01' } = attributes;
    const styles = Object.keys(compilation.assets)
        .find(x => x.endsWith('.css'));
    const currentImages = getCurrentImages(locals.sets, locals.path);
    const tmplDefaults = {
        styles,
    };
    const js = Object.keys(compilation.assets)
        .find(x => x.includes('scripts.') && x.endsWith('.js'));

    if (currentImages.length) {
        appendDetailPagesForAlbum(tmplDefaults, currentImages,
            compilation.compiler, locals.path, js);
    }

    const content = marked(body.trim());
    const html = views[view](title, content, Object.assign({}, locals, {
        images: currentImages,
        published,
    }));
    return callback(null, template({ title, html, js, ...tmplDefaults }));
}
