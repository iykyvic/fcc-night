'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _jsLogger = require('js-logger');

var _jsLogger2 = _interopRequireDefault(_jsLogger);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _debug2.default)('fccnight:app');
_jsLogger2.default.useDefaults();

var app = (0, _express2.default)();
var _process = process,
    _process$env = _process.env,
    NODE_ENV = _process$env.NODE_ENV,
    PORT = _process$env.PORT;

var isDevMode = NODE_ENV === 'development';

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
var normalizePort = function normalizePort(val) {
  var portNumber = parseInt(val, 10);
  if (isNaN(portNumber)) {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }
  return false;
};

var port = normalizePort(PORT || '3000');

app.server = _http2.default.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
var onError = function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      _jsLogger2.default.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      _jsLogger2.default.error(bind + ' is already in use');
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
var onListening = function onListening() {
  var addr = app.server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  _jsLogger2.default.debug('\uD83D\uDEA7 App is Listening on ' + bind);
};
var headers = 'Origin, X-Requested-With, Content-Type, Accept';

app.set('port', port);
app.set('json spaces', 2);
app.set('json replacer', function (key, value) {
  var excludes = ['password', '_raw', '_json', '__v'];

  return excludes.includes(key) ? undefined : value;
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', headers);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
isDevMode ? app.use(_express2.default.static(_path2.default.resolve(__dirname, '../src'))) : app.use(_express2.default.static(_path2.default.resolve(__dirname, '../dist')));
app.use((0, _serveFavicon2.default)(_path2.default.resolve(__dirname, '../favicon.ico')));
app.use((0, _morgan2.default)('dev'));

app.use('/api/v1/search', _routes2.default.search);
app.use('*', _routes2.default.home);

app.server.listen(port).on('listening', onListening).on('error', onError);

exports.default = app;