const module1Routes = require('./module1/routes');

module.exports = {
  registerRoutes: (router) => {
    module1Routes.registerRoutes(router);
  },
};
