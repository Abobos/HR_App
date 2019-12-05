import http from 'http';
import { App } from './app';
import { logger } from './utils';

const expressApp = new App();

const PORT = expressApp.getPort();

const server = http.createServer(expressApp.app);

server.listen(PORT, () =>
  logger(`${expressApp.getEnv()}:server`, `App started on PORT ${PORT}`)
);

import express from 'express';
import '@babel/polyfill';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const env = app.get('env');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

dotenv.config();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Property Pro API');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', userRoute, propertyRoute, flagRoute);

app.all('*', (req, res) =>
  res.status(404).json({
    status: 'error',
    error: 'This route is unavailable'
  })
);

app.listen(port, () => {
  logger(`${env}:server`, `App started on PORT ${port}`);
});

export default app;
