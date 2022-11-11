import config from './config';
import { ErrorHandler } from './simple-express-types';

const errorHandlers: ErrorHandler[] = [
  error => ({
    status: error.httpStatus || error.defaultHttpStatus || 500,
    body: {
      message: (config.env === 'development' && error.devMessage)
        || error.message
        || error.defaultMessage
        || 'Unknown error',
      details: (config.env === 'development' && error.details) || undefined,
    }
  }),
  error => ({
    status: 500,
    body: 'Unknown error - error handling failed'
  }),
];

export default errorHandlers;
