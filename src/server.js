require('dotenv').config();
const express = require('express');
const debug = require('debug')('api');
const { join } = require('path');
const bodyParser = require('body-parser');
const osprey = require('osprey');
const helmet = require('helmet');
const { registerRoutes } = require('./routes');

const app = express();
const router = osprey.Router();

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

registerRoutes(router);
const port = 3000 || process.env.PORT;
osprey.loadFile(join(__dirname, '../raml', 'api.raml'))
  .then((middleware) => {
    app.use('/raml', middleware, router);
    app.listen(port, () => {
      debug('--------------------------');
      debug('☕️ ');
      debug('Starting Server');
      debug(`Environment: ${process.env.NODE_ENV}`);
      debug(`Express Listening at http://127.0.0.1:${port}`);
    });
  })
  .catch(e => debug(e));
