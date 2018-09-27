const debug = require('debug');
const module1 = require('./index');

module.exports = {
  registerRoutes: (router) => {
    debug('**** GET /module1 ****');
    router.get('/module1', (req, res) => res.send(module1.action()));
  },
};
