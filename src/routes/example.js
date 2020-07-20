export default [
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
