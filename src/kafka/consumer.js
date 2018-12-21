
const debug = require('debug')('kafka');
const Kafka = require('node-rdkafka');
const axios = require('axios');

const globalConfig = {
  'api.version.request': false,
  'group.id': 'kafka',
  'metadata.broker.list': 'localhost:9092',
};

const topicConfig = {};

const consumer = new Kafka.KafkaConsumer(globalConfig, topicConfig);

const handleMessage = (bufferData) => {
  const jsonDataValue = JSON.parse(bufferData.value.toString());
  const key = JSON.parse(bufferData.key.toString());
  const {
    method,
    // data,
    headers,
    url,
  } = jsonDataValue;
  const requestObject = {
    method: method.toLowerCase(),
    // data,
    headers,
    url,
  };
  console.log(JSON.stringify(requestObject));
  axios.request(requestObject)
    .then(debug)
    .catch(debug);
};

consumer
  .on('ready', () => {
    consumer.subscribe(['requests']);
    consumer.consume();
  })
  .on('data', handleMessage);

// const stream = Kafka.KafkaConsumer.createReadStream(globalConfig, topicConfig, {
//   topics: ['requests'],
// });

// stream.on('data', (message) => {
//   debug('Got message');
//   console.log('got message');
//   debug(message.value.toString());
// });

module.exports = consumer;
