const redis = require('redis');
const bluebird = require('bluebird');
const debug = require('debug')('redis');

bluebird.promisifyAll(redis);

const client = redis.createClient();

client.on('error', err => debug(`Error ${err}`));

client.on('ready', () => debug('Redis ready'));

module.exports = client;
