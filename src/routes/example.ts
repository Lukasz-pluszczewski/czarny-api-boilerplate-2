import { Routes } from '../simple-express-types';

const routes: Routes[] = [
  ['/**', {
    get: async ({ body, query, params, originalUrl, protocol, xhr, get, req, db }) => {
      return {
        body: {
          message: 'Request success',
          body,
          query,
          params,
          originalUrl,
          protocol,
        },
      };
    },
  }],
];

export default routes;
