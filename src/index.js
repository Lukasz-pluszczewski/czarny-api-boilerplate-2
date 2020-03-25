import checkPassword from 'middleware/checkPassword';
import config from './config';
import routes from 'routes';

import simpleExpress from 'simple-express';

(async function() {

  simpleExpress({
    port: config.port,
    routes: {
      ...routes,
    },
    globalMiddlewares: [
      checkPassword(config.password),
    ],
    routeParams: {},
    errorHandlers: [
      error => {
        console.log('Unknown error', error);
        return {
          status: 500,
          body: { message: 'Unknown error' },
        };
      },
    ],
  })
    .then(({ app }) => console.log(`Started on port ${app.server.address().port}`))
    .catch(error => console.error('Error', error));
})();
