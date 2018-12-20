require('dotenv').config();
const express = require('express');
const debug = require('debug')('api');
const { join } = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const httpProxy = require('http-proxy')
const kafka = require('./kafka');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(helmet({
  hsts: false,
  noSniff: false,
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  next();
});

app.use('/', express.static(join(__dirname, '../public_static')));

app.get('/robots.txt', (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    res.end();
  } else {
    next();
  }
});

const proxy = httpProxy.createProxyServer({ target: 'http://localhost:3000' });
app.use((req, res) => {
  redisClient.incrAsync('counter')
    .then(() => proxy.web(req, res));

});

const port = 4000 || process.env.PORT;
app.listen(port, () => {
  debug('--------------------------');
  debug('☕️ ');
  debug('Starting Server');
  debug(`Environment: ${process.env.NODE_ENV}`);
  debug(`Express Listening at http://127.0.0.1:${port}`);
});
