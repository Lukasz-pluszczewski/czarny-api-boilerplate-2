import config from './config';
import routes from './routes';
import errorHandlers from './errorHandlers';

import simpleExpress from 'simple-express-framework';

(async function() {
  simpleExpress({
    port: config.port,
    routes,
    errorHandlers,
    routeParams: {},
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
