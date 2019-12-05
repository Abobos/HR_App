import '@babel/polyfill';
import http from 'http';

import expressApp from './app';

import logger from './utils';

const PORT = expressApp.getPort();

const server = http.createServer(expressApp.app);

server.listen(PORT, () =>
  logger(`${expressApp.getEnv()}:server`, `App started on PORT ${PORT}`),
);
