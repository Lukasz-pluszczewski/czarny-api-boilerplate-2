import { AddressInfo } from 'net';
import simpleExpress from 'simple-express-framework';

import config from './config';
import routes from './routes';

import errorHandlers from './errorHandlers';
import { RouteParams } from './types';


(async function () {
  simpleExpress<RouteParams>({
    port: config.port,
    routes,
    errorHandlers,
    routeParams: {
      SOME_CONSTANT: 'some value',
    },
  })
    .then(({ server }) =>
      console.log(`Started on port ${(server.address() as AddressInfo).port}`)
    )
    .catch((error) => console.error('Error', error));
})();
