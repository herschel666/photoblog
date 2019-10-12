const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const fetch = require('node-fetch');

const { NETLIFY_ACCESS_TOKEN } = process.env;
const SRC_DIR = path.join(process.cwd(), 'public');
const FILE_NAME = path.join(process.cwd(), 'site.zip');

const stat = promisify(fs.stat);
const rm = promisify(fs.unlink);

const clean = async () => {
  console.log('> Remove exisiting Zip file...');
  await rm(FILE_NAME);
};

const writeZipFile = () =>
  new Promise((resolve, reject) => {
    console.log('> Create new Zip file...');
    const output = fs.createWriteStream(FILE_NAME);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    output.on('close', resolve);
    archive.on('warning', reject);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(SRC_DIR, false);
    archive.finalize();
  });

const uploadZipFile = async () => {
  console.log('> Upload Zip file...');
  const { size } = await stat(FILE_NAME);
  const body = fs.createReadStream(FILE_NAME);

  await fetch('https://api.netlify.com/api/v1/sites/ek-photos-cdn/deploys', {
    method: 'POST',
    headers: {
      'content-length': size,
      'content-type': 'application/zip',
      authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
    },
    body,
  });
};

const finish = () => console.log('> Successfully deployed site.');

[clean, writeZipFile, uploadZipFile, finish].reduce(
  (promise, fn) => promise.then(fn, console.error),
  Promise.resolve()
);
