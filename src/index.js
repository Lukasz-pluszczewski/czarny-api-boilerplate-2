import checkPassword from 'middleware/checkPassword';
import config from './config';
import routes from 'routes';

import createDatabase from './services/mongoDatabaseService';

import simpleExpress from 'services/simpleExpress/simpleExpress';

(async function() {
  const db = await createDatabase();

  simpleExpress({
    port: config.port,
    routes,
    globalMiddlewares: [
      checkPassword(config.password),
    ],
    routeParams: { db },
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
