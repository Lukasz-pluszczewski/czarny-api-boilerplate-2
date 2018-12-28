import { Router as router } from 'express';
import { ObjectID } from 'mongodb';
import { find, findLast, insert, remove, update } from 'services/mongoDatabaseService';

export default ({ db }) => {
  const api = router();

  api.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      dbConnected: db.serverConfig.isConnected(),
    });
  });

  return api;
};
