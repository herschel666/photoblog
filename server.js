const { createServer } = require('phox');
const { port } = require('./phox.config');

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection in photoblog', error.message);
  if (Boolean(error.stack)) {
    console.error(error.stack);
  }
  process.exit();
});

createServer().then(({ server }) =>
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    // tslint:disable-next-line no-console
    console.log(`Server running on http://localhost:${port} ...`);
  })
);
