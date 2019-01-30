require('dotenv').config();
const app = require('express')();
const debug = require('debug')('api');
const helmet = require('helmet');
const http = require('http');
const proxy = require('express-http-proxy');
const Prometheus = require('./prometheus');
const RateLimter = require('limiter').RateLimiter;

const limiter = new RateLimter(150, 'second');

app.use(helmet({
  hsts: false,
  noSniff: false,
}));

app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);
Prometheus.injectMetricsRoute(app);

limiter.removeTokens(1, (err, remainingRequests) => {
  Prometheus.startCollection();
})

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

const target = process.env.BACK_END_URL || 'http://localhost:3000';
const port = 4000 || process.env.PORT;
app.use('/', proxy(target)).listen(port, () => {
  debug('--------------------------');
  debug('☕️ ');
  debug('Starting Server');
  debug(`Environment: ${process.env.NODE_ENV}`);
  debug(`Express Listening at http://127.0.0.1:${port}`);
});

if (!process.env.BACK_END_URL) {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Response from back-end!\n${JSON.stringify(req.headers, true, 2)}`);
    res.end();
  }).listen(3000);
}
