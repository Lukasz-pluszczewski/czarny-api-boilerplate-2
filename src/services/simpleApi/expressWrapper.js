import { Router } from 'express';
import simpleApi, { NotFoundError } from './';

export const expressWrapper = (adapter, options) => resource => {
  const api = simpleApi(adapter, options)(resource);

  const router = new Router();

  router.get('/', (req, res, next) => {
    api.get({ query: req.query, params: req.params })
      .then(data => res.json(data))
      .catch(next);
  });

  router.post('/', (req, res, next) => {
    api.post({ query: req.query, params: req.params, body: req.body })
      .then(data => res.json(data))
      .catch(next);
  });

  router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    adapter.put({ resource, id, data })
      .then(data => res.json(data))
      .catch(next);
  });

  router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    adapter.delete({ resource, id })
      .then(data => res.json(data))
      .catch(next);
  });


  return {
    routes: router,
    errorHandlers: [
      (error, req, res, next) => {
        if (error instanceof NotFoundError) {
          return res.status(404).send({ message: error.message || 'Not found' });
        }

        next(error);
      },
    ],
  };
};

export default expressWrapper;
