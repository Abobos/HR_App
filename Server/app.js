import express from 'express';
import indexRoute from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';
import defaultErrorHandler from './middlewares/error';

class App {
  constructor(port = '') {
    this.port = port;
    this.app = express();
    this.settings();
    this.middlewares();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  middlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(cors());

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

export default new App();
