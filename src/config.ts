const config = {
  env: process.env.env || 'production',
  port: process.env.PORT || 8080,
} as const;

export default config;
