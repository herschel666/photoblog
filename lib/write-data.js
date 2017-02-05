
const { writeFile, readFile } = require('fs');
const path = require('path');
const glob = require('glob');
const async = require('async');
const fm = require('front-matter');
const marked = require('marked');
const { NEXT, ALBUMS } = require('./config');

const fetchAlbums = () => new Promise((resolve, reject) =>
    glob(`${ALBUMS}/*`, (err, albums) => {
        if (err) {
            return reject(err);
        }
        return resolve(albums);
    }));

const getAlbumImages = (albumDir) => {
    const albumName = path.basename(albumDir);
    const images = glob.sync(`${albumDir}/*.jpg`);
    return images.map(img => `/img/${albumName}/${path.basename(img)}`);
};

const addData = (albumDir, done) =>
    readFile(path.join(albumDir, '_index.md'), 'utf8', (err, data) => {
        if (err) {
            return done(err);
        }
        const { attributes, body } = fm(data);
        return done(null, Object.assign({}, attributes, {
            slug: path.basename(albumDir),
            content: marked(body.trim()),
            images: getAlbumImages(albumDir),
        }));
    });

const gatherAlbumData = albums => new Promise((resolve, reject) =>
    async.map(albums, addData, (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve(data);
    }));

const writeAlbumData = data => new Promise((resolve, reject) =>
    writeFile(path.join(NEXT, 'albums.json'), JSON.stringify(data), (err) => {
        if (err) {
            return reject(err);
        }
        return resolve();
    }));

module.exports = () => fetchAlbums()
    .then(gatherAlbumData)
    .then(writeAlbumData);
