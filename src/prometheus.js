/**
 * Newly added requires
 */
const promClient = require('prom-client');
const { Counter, Histogram, Summary } = require('prom-client');
const responseTime = require('response-time');
const debug = require('debug');

/**
 * A Prometheus counter that counts the invocations of the different HTTP verbs
 * e.g. a GET and a POST call will be counted as 2 different calls
 */
const numOfRequests = new Counter({
  name: 'numOfRequests',
  help: 'Number of requests made',
  labelNames: ['method'],
});

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
const pathsTaken = new Counter({
  name: 'pathsTaken',
  help: 'Paths taken in the app',
  labelNames: ['path'],
});

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
const responses = new Summary({
  name: 'responses',
  help: 'Response time in millis',
  labelNames: ['method', 'path', 'status'],
});

/**
 * A Prometheus histogram to record the HTTP route path and latency
 */
const httpRequestDurationMilliseconds = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500],
});

/**
 * This funtion will start the collection of metrics
 * and should be called from within in the main js file
 */
function startCollection() {
  debug('Starting the collection of metrics, the metrics are available on /metrics');
  promClient.collectDefaultMetrics();
}

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
function requestCounters(req, res, next) {
  if (req.path !== '/metrics') {
    numOfRequests.inc({ method: req.method });
    pathsTaken.inc({ path: req.path });
  }
  next();
}

/**
 * This function increments the counters that are executed on the response side of an invocation
 * Currently it updates the responses summary
 */
function responseCounters(req, res, time) {
  if (req.url !== '/metrics') {
    responses.labels(req.method, req.url, res.statusCode).observe(time);
    httpRequestDurationMilliseconds.labels(req.originalUrl).observe(time);
  }
}


/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
function injectMetricsRoute(App) {
  App.get('/metrics', (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(promClient.register.metrics());
  });
}

const prometheus = {
  numOfRequests,
  pathsTaken,
  responses,
  requestDuration: httpRequestDurationMilliseconds,
  startCollection,
  requestCounters,
  responseCounters: responseTime(responseCounters),
  injectMetricsRoute,
};

module.exports = prometheus;
