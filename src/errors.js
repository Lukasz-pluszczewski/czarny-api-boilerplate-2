import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';

class BaseError extends Error {
  constructor({
  message = 'Unknown error',
  httpStatus = INTERNAL_SERVER_ERROR,
  devMessage,
  details,
} = {}) {
    super(message);
    this.devMessage = devMessage;
    this.httpStatus = httpStatus;
    this.details = details;
  }
}

export class RouteNotFoundError extends BaseError {
  defaultMessage = 'Route not found';
  defaultHttpStatus = NOT_FOUND;
}
