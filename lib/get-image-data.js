
const { readFile, createReadStream } = require('fs');
const path = require('path');
const glob = require('glob');
const asyncLib = require('async');
const { ExifImage } = require('exif');
const readIptc = require('node-iptc');
const getImageSize = require('probe-image-size');
const marked = require('marked');
const { decode } = require('utf8');

const rootPath = process.cwd();

const getExifData = image => new Promise((resolve, reject) => {
    try {
        // eslint-disable-next-line no-new
        new ExifImage({ image }, (err2, exif) => {
            if (err2) {
                return reject(err2);
            }
            return resolve(exif);
        });
    } catch (err3) {
        reject(err3);
    }
});

const getIptcData = image => new Promise((resolve, reject) =>
    readFile(image, (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve(readIptc(data) || {});
    }));

const getOrientation = image => new Promise((resolve, reject) => {
    const input = createReadStream(image);
    getImageSize(input).then(({ width, height }) => {
        if (width === height) {
            resolve('square');
        } else {
            resolve(width > height ? 'landscape' : 'portrait');
        }
        input.destroy();
    }).catch(reject);
});

const getCreationDateFromString = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6);
    return String(new Date(`${year}-${month}-${day}`));
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
    title: decode(iptc.object_name),
    description: marked(decode(iptc.caption || '')),
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

module.exports = {
    apply(compiler) {
        compiler.plugin('make', (compilation, callback) => {
            Object.assign(compilation, { metadata: {} });
            glob(path.join(rootPath, 'pages', '**/*.jpg'), (err, files) => {
                if (err) {
                    callback(err);
                    return;
                }
                asyncLib.each(files, (image, done) => Promise.all([
                    getExifData(image),
                    getIptcData(image),
                    getOrientation(image),
                ]).then(([exif, iptc, orientation]) => {
                    const metadata = Object.assign(
                        getDetailsFromMeta(iptc, exif), { orientation });
                    Object.assign(compilation.metadata, {
                        [path.basename(image)]: metadata,
                    });
                    done();
                }).catch(callback), callback);
            });
        });
    },
};
