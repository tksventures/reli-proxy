require('dotenv').config();
const express = require('express');
const debug = require('debug')('api');
const helmet = require('helmet');
const http = require('http');
const httpProxy = require('http-proxy');
const redis = require('redis');
const Prometheus = require('./prometheus');

const app = express();

app.use(helmet({
  hsts: false,
  noSniff: false,
}));

app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);
Prometheus.injectMetricsRoute(app);
Prometheus.startCollection();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (process.env.NODE_ENV !== 'production') {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  next();
});

const redisServer = process.env.REDIS_URL || '';
const client = redis.createClient(redisServer);
const limiter = require('express-limiter')(app, client);

const expireInSeconds = process.env.EXPIRE_IN_SECONDS || 15;
const requestLimit = process.env.REQUEST_LIMIT || 99;
const limitByIP = process.env.LIMIT_BY_IP ? 'connection.remoteAddress' : 'hostname';
limiter({
  path: '*',
  method: 'all',
  lookup: limitByIP,
  total: requestLimit,
  expire: 1000 * expireInSeconds,
});

const target = process.env.BACK_END || 'http://localhost:3000';
const proxy = httpProxy.createProxyServer({ target });
app.use((req, res) => proxy.web(req, res));

const port = 4000 || process.env.PORT;
app.listen(port, () => {
  debug('--------------------------');
  debug('☕️ ');
  debug('Starting Server');
  debug(`Environment: ${process.env.NODE_ENV}`);
  debug(`Express Listening at http://127.0.0.1:${port}`);
});

if (!process.env.BACK_END) {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Response from back-end!\n${JSON.stringify(req.headers, true, 2)}`);
    res.end();
  }).listen(3000);
}
