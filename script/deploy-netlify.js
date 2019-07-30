const { spawn } = require('child_process');

const { BRANCH } = process.env;

const args = ['run', 'build'];

if (BRANCH === 'master') {
  args.push('--', '--prefix-paths');
}

const ps = spawn('npm', args);

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
