/*
 * node-rdkafka - Node.js wrapper for RdKafka C/C++ library
 *
 * Copyright (c) 2016 Blizzard Entertainment
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

const debug = require('debug')('kafka');
const Kafka = require('node-rdkafka');

debug(Kafka.features);

const producer = new Kafka.Producer({
  // 'debug' : 'all',
  'metadata.broker.list': 'localhost:9092',
  dr_cb: true, // delivery report callback
});

const topicName = 'test';

// logging debug messages, if debug is enabled
producer.on('event.log', (log) => {
  debug(log);
});

// logging all errors
producer.on('event.error', (err) => {
  debug('Error from producer');
  debug(err);
});

// counter to stop this sample after maxMessages are sent
let counter = 0;
const maxMessages = 10;

producer.on('delivery-report', (err, report) => {
  debug(`delivery-report: ${JSON.stringify(report)}`);
  counter += 1;
});

// Wait for the ready event before producing
producer.on('ready', (arg) => {
  debug(`producer ready. ${JSON.stringify(arg)}`);

  for (let i = 0; i < maxMessages; i += 1) {
    const value = Buffer.from(`value-${i}`);
    const key = `key-${i}`;
    //  if partition is set to -1, librdkafka will use the default partitioner
    const partition = -1;
    producer.produce(topicName, partition, value, key);
  }

  // need to keep polling for a while to ensure the delivery reports are received
  const pollLoop = setInterval(() => {
    producer.poll();
    if (counter === maxMessages) {
      clearInterval(pollLoop);
      producer.disconnect();
    }
  }, 1000);
});

producer.on('disconnected', (arg) => {
  debug(`producer disconnected. ${JSON.stringify(arg)}`);
});

// starting the producer
const woo = producer.connect();

setTimeout(() => console.log(woo), 5000);

module.exports = producer;
