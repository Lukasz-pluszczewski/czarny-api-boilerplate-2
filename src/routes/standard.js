const healthRoutes = [
  ['/health', {
    get: () => ({
      body: {
        status: 'healthy',
      },
    }),
  }],
  ['*', {
    get: () => console.log('WAT?') || ({
      status: 404,
      body: { message: 'Route not found' },
    }),
  }],
];

export default healthRoutes;
