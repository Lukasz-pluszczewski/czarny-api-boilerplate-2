import { RouteNotFoundError } from '../errors';

export default [
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
