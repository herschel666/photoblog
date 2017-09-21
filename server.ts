import phox, { createServer } from 'phox';
import { port } from './phox.config';

process.on('unhandledRejection', error => {
  console.error('unhandledRejection in photoblog', error.message);
  if (Boolean(error.stack)) {
    console.error(error.stack);
  }
  process.exit();
});

createServer().then(({ server }: phox.Server) =>
  server.listen(port, (err: any) => {
    if (err) {
      throw err;
    }
    // tslint:disable-next-line no-console
    console.log(`Server running on http://localhost:${port} ...`);
  })
);
