import { Routes } from 'simple-express-framework';
import { RouteParams } from '../types';

const routes: Routes<RouteParams>[] = [
  ['/**', {
    get: async ({ body, query, params, originalUrl, protocol, xhr, get, req }) => {

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
