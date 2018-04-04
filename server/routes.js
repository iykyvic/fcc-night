import express from 'express';
import axios from 'axios';
import { config } from 'dotenv';
import path    from 'path';

config();

const home = express.Router();
const search = express.Router();
const { NODE_ENV, YELP_API_KEY } = process.env;
const isDevMode = NODE_ENV === 'development';

const index = isDevMode ? '../src/index.html' : '../dist/index.html'

home.get('*', (req, res) => res
  .sendFile(path.join(__dirname, index)));

search.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, location = '', terms = '' } = req.query;
    const url = 'https://api.yelp.com/v3/businesses/search';
    const { data } = await axios({
      url,
      params: { limit, offset, terms, location },
      headers: { Authorization: `Bearer ${YELP_API_KEY}` }
    });

    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

export default { home, search };

