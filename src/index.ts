import { AddressInfo } from 'net';

import config from './config';
import routes from './routes';

import errorHandlers from './errorHandlers';
import simpleExpress from 'simple-express-framework';

(async function () {
  simpleExpress({
    port: config.port,
    routes,
    errorHandlers,
    routeParams: {},
  })
    .then(({ server }) =>
      console.log(`Started on port ${(server.address() as AddressInfo).port}`)
    )
    .catch((error) => console.error('Error', error));
})();
