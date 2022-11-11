import { RouteNotFoundError } from '../errors';
import { Routes } from '../simple-express-types';

const routes: Routes[] = [
  ['/health', {
    get: () => ({
      body: {
        status: 'healthy',
      },
    }),
  }],
  ['*', {
    get: () => new RouteNotFoundError(),
  }],
];

export default routes;
