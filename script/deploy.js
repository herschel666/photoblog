const assert = require('assert');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const fetch = require('node-fetch');

const { NETLIFY_ACCESS_TOKEN } = process.env;
const SRC_DIR = path.join(process.cwd(), 'public');
const FILE_NAME = path.join(process.cwd(), 'site.zip');
const API_BASE = 'https://api.netlify.com/api/v1';

assert(NETLIFY_ACCESS_TOKEN, 'The $NETLIFY_ACCESS_TOKEN is defined.');

const stat = promisify(fs.stat);
const rm = promisify(fs.unlink);

const wait = (delay = 5000) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const clean = async () => {
  console.log('> Remove exisiting Zip file...');
  try {
    await rm(FILE_NAME);
  } catch {
    /* empty */
  }
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
  const response = await fetch(
    `${API_BASE}/sites/ek-photos-cdn.netlify.com/deploys`,
    {
      method: 'POST',
      headers: {
        'content-length': size,
        'content-type': 'application/zip',
        authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      },
      body,
    }
  );

  return response.json();
};

const getDeployState = async (deployId) => {
  const response = await fetch(`${API_BASE}/deploys/${deployId}`, {
    headers: {
      authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
    },
  });
  const { state } = await response.json();
  return state;
};

const isPending = (state) => state !== 'ready' && state !== 'error';

const checkForReady = async ({ id: deployId }) => {
  let state = 'unknown';

  process.stdout.write('> Check for deployment state...');
  while (isPending(state)) {
    await wait();
    state = await getDeployState(deployId);
    process.stdout.write('.');
  }
  process.stdout.write('\n');

  return state;
};

const finish = (state) => {
  if (state === 'error') {
    console.error('> Failed deploying site.');
    process.exit(1);
  }
  console.log('> Successfully deployed site.');
};

[clean, writeZipFile, uploadZipFile, checkForReady, finish].reduce(
  (promise, fn) => promise.then(fn, console.error),
  Promise.resolve()
);
