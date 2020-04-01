import checkPassword from 'middleware/checkPassword';
import config from './config';
import routes from 'routes';

import createDatabase from './services/mongoDatabaseService';

import simpleExpress from 'simple-express';
// import simpleExpress from './services/simpleExpress/simpleExpress';
import { adapters } from './services/simpleApi';
import simpleApi, { errorHandlers as simpleApiErrorHandlers } from './services/simpleApi/simpleExpressWrapper';

(async function() {
  // const db = await createDatabase();

  simpleExpress({
    port: config.port,
    routes: {
      ...routes,
      ...simpleApi(adapters.mongodb(db))([
        'articles',
        'users',
      ]).routes,
    },
    globalMiddlewares: [
      checkPassword(config.password),
    ],
    routeParams: { db: {} },
    errorHandlers: [
      // ...simpleApiErrorHandlers,
      error => {
        console.log('Unknown error', error);
        return {
          status: 500,
          body: { message: 'Unknown error' },
        };
      },
    ],
  })
    .then(({ app }) => {
      console.log(`Started on port ${app.server.address().port}`);
    })
    .catch(error => console.error('Error', error));
})();
