const exampleRoutes = {
  '/example/**': {
    get: async ({ body, query, params, originalUrl, protocol, xhr, get, req, db }) => {
      return {
        body: {
          message: 'Request success',
          body,
          query,
          originalUrl,
          protocol,
        },
      };
    },
  },
};

export default exampleRoutes;
