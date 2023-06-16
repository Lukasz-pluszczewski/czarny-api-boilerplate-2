import { RouteNotFoundError } from '../errors';
import { Routes } from 'simple-express-framework';
import { RouteParams } from '../types';

const routes: Routes<RouteParams>[] = [
  ['/health', {
    get: () => ({
      body: {
        status: 'healthy',
      },
    }),
  }],
  ['*', {
    get: () => new RouteNotFoundError({ devMessage: 'You ran out of routes!' }),
  }],
];

export default routes;
