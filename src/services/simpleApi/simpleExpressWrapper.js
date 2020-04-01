import simpleApi, { NotFoundError } from './';

export const simpleExpressWrapper = (adapter, options) => resource => {
  const api = simpleApi(adapter, options)(resource);

  if (Array.isArray(resource)) {
    const getRoutes = simpleExpressWrapper(adapter, options);
    return {
      routes: resource.reduce((routes, resource) => [...routes, ...getRoutes(resource).routes], []),
      errorHandlers: [],
    };
  }

  return {
    routes: [
      {
        path: `/${resource}`,
        handlers: {
          get: (...params) => api.get(...params).then(body => ({ body })),
          post: (...params) => api.post(...params).then(body => ({ body })),
        },
      },
      {
        path: `/${resource}/:id`,
        handlers: {
          put: (...params) => api.put(...params).then(body => ({ body })),
          delete: (...params) => api.delete(...params).then(body => ({ body })),
        },
      },
    ],
    errorHandlers: [],
  };
};

export const errorHandlers = [
  (error, { next }) => {
    if (error instanceof NotFoundError) {
      return {
        status: 404,
        body: { message: error.message || 'Not found' },
      };
    }
    next(error);
  },
];

export default simpleExpressWrapper;
