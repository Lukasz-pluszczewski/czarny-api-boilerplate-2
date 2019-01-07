const config = {
  port: process.env.PORT || 8080,
  dbName: process.env.DB_NAME || 'changeThisDbName',
  dbHost: process.env.DB_HOST || 'localhost:27017',
  password: process.env.ADMIN_PASSWORD,
};

export default config;
