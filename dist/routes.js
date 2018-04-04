'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _dotenv = require('dotenv');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _dotenv.config)();

var home = _express2.default.Router();
var search = _express2.default.Router();
var _process$env = process.env,
    NODE_ENV = _process$env.NODE_ENV,
    YELP_API_KEY = _process$env.YELP_API_KEY;

var isDevMode = NODE_ENV === 'development';

var index = isDevMode ? '../src/index.html' : '../dist/index.html';

home.get('*', function (req, res) {
  return res.sendFile(_path2.default.join(__dirname, index));
});

search.get('/', async function (req, res) {
  try {
    var _req$query = req.query,
        _req$query$limit = _req$query.limit,
        limit = _req$query$limit === undefined ? 10 : _req$query$limit,
        _req$query$offset = _req$query.offset,
        offset = _req$query$offset === undefined ? 0 : _req$query$offset,
        _req$query$location = _req$query.location,
        location = _req$query$location === undefined ? '' : _req$query$location,
        _req$query$terms = _req$query.terms,
        terms = _req$query$terms === undefined ? '' : _req$query$terms;

    var url = 'https://api.yelp.com/v3/businesses/search';

    var _ref = await (0, _axios2.default)({
      url: url,
      params: { limit: limit, offset: offset, terms: terms, location: location },
      headers: { Authorization: 'Bearer ' + YELP_API_KEY }
    }),
        data = _ref.data;

    return res.status(200).json({ status: 'success', data: data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

exports.default = { home: home, search: search };