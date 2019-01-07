const healthRoutes = [
  {
    path: '/health',
    handlers: {
      get: ({ body, query, params, originalUrl, protocol, xhr, get, req, db }) => {
        return {
          body: {
            status: 'healthy',
            dbConnected: db.serverConfig.isConnected(),
          },
        };
      },
    },
  },
];

export default healthRoutes;
