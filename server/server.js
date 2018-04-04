import debug            from 'debug';
import path             from 'path';
import express          from 'express';
import favicon          from 'serve-favicon';
import logger           from 'morgan';
import Logger           from 'js-logger';
import http             from 'http';
import Routes           from './routes';

debug('fccnight:app');
Logger.useDefaults();

const app = express();
const { env: { NODE_ENV, PORT } } = process;
const isDevMode = NODE_ENV === 'development';

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
const normalizePort = (val) => {
  const portNumber = parseInt(val, 10);
  if (isNaN(portNumber)) {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }
  return false;
};

const port = normalizePort(PORT || '3000');

app.server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      Logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 * @returns {null} server process is continous here, so no returns
 */
const onListening = () => {
  const addr = app.server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  Logger.debug(`🚧 App is Listening on ${bind}`);
};
const headers = 'Origin, X-Requested-With, Content-Type, Accept';

app.set('port', port);
app.set('json spaces', 2);
app.set('json replacer', (key, value) => {
  const excludes = ['password', '_raw', '_json', '__v'];

  return excludes.includes(key) ? undefined : value;
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', headers);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
isDevMode ? app.use(express.static(path.resolve(__dirname, '../src'))) :
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(favicon(path.resolve(__dirname, '../favicon.ico')));
app.use(logger('dev'));

app.use('/api/v1/search', Routes.search);
app.use('*', Routes.home);

app.server.listen(port)
  .on('listening', onListening)
  .on('error', onError);

export default app;
