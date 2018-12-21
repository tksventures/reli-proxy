const producer = require('./kafka/producer');
const consumer = require('./kafka/consumer');

producer.connect();
consumer.connect();

let counter = -1;

const prepareRequestObject = req => JSON.stringify({
  headers: req.headers,
  query: req.query,
  data: req.body,
  method: req.method,
  url: `http://localhost:3000${req.originalUrl}`,
});

const handleRequest = (req) => {
  console.log(`http://${req.headers.host}${req.originalUrl}`);
  counter += 1;
  producer.produce('requests', -1, Buffer.from(prepareRequestObject(req)), counter);

  // then read
};

const revealingModule = {
  handleRequest,
};

module.exports = revealingModule;
