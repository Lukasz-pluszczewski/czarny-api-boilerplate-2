const healthRoutes = {
  '/health': {
    get: () => ({
      body: {
        status: 'healthy',
      },
    }),
  },
  '/*': {
    use: () => ({
      status: 404,
      body: { message: 'Route not found' },
    }),
  },
};

export default healthRoutes;
