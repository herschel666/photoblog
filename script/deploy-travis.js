const { spawn } = require('child_process');

const { TRAVIS_BRANCH, BUILD_HOOK_ID } = process.env;

const querystring =
  TRAVIS_BRANCH === 'master' ? '' : `?trigger_branch=${TRAVIS_BRANCH}`;
const url = `https://api.netlify.com/build_hooks/${BUILD_HOOK_ID}${querystring}`;
const args = ['-X', 'POST', '-d', '{}', url];
const ps = spawn('curl', args);

ps.stdout.on('data', (data) => {
  console.log(String(data));
});

ps.stderr.on('data', (data) => {
  console.log(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`process exited with code ${code}`);
  }
});
