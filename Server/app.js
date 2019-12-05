import express from 'express';

import indexRoute from './routes';
import defaultErrorHandler from './middlewares/error';

class App {
  constructor(port = '') {
    this.port = port;
    this.app = express();
    this.settings();
    this.middlewares();
  }

  settings() {
    this.app.set('port', this.port || 3000 || process.env.PORT);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(indexRoute);

    defaultErrorHandler(this.app);
  }

  getEnv() {
    return this.app.get('env');
  }

  getPort() {
    return this.app.get('port');
  }
}

export default App;
