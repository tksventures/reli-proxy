require('dotenv').config();
const app = require('express')();
const debug = require('debug')('api');
const helmet = require('helmet');
const http = require('http');
const proxy = require('express-http-proxy');
const redis = require('redis');
const Prometheus = require('./prometheus');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const slowDown = require('express-slow-down');

const redisServer = process.env.REDIS_URL || '';
const client = redis.createClient(redisServer);

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

const expireInSeconds = process.env.EXPIRE_IN_SECONDS || 15;
const requestLimit = process.env.REQUEST_LIMIT || 99;
const delayTimeInSeconds = process.env.DELAY_IN_SECONDS || 0.5;
const speedLimiter = slowDown({
  store: new RedisStore({
    client,
    prefix: 'sd: ', // setting prefix to avoid collision between delaying and rate limiting requests
    expiry: expireInSeconds,
  }),
  windowMs: 1000 * expireInSeconds, // 1 minutes
  delayAfter: requestLimit, // allow specified requests per window time
  // begin adding specified delay time per request above maximum limit:
  delayMs: 1000 * delayTimeInSeconds,
});

const rateLimiter = new RateLimit({
  store: new RedisStore({
    client,
    prefix: 'rl: ', // setting prefix to avoid collision between delaying and rate limiting requests
    expiry: expireInSeconds,
  }),

  windowMs: 1000 * expireInSeconds, // setting window size in ms(eg: 2000)
  max: requestLimit, // limit each IP to specified requests per windowMs (e.g: 1)
});

app.use(speedLimiter);
app.use(rateLimiter);
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

