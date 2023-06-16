import { ErrorHandler } from 'simple-express-framework';
import config from './config';
import { RouteParams } from './types';

const errorHandlers: ErrorHandler<RouteParams>[] = [
  error => (console.log('error', error), ({
    status: error.httpStatus || error.defaultHttpStatus || 500,
    body: {
      message: error.message || error.defaultMessage || 'Unknown error',
      ...((config.env === 'dev' && error.devMessage) ? { devMessage: error.devMessage } : {}),
      ...((config.env === 'dev' && error.details) ? { details: error.details } : {}),
    }
  })),
  error => ({
    status: 500,
    body: 'Unknown error - error handling failed'
  }),
];

export default errorHandlers;
