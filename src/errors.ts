import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';

type BaseErrorParams = {
  message?: string,
  httpStatus?: number,
  devMessage?: string,
  details?: any,
};
class BaseError extends Error {
  constructor({
    message,
    httpStatus = INTERNAL_SERVER_ERROR,
    devMessage,
    details,
  }: BaseErrorParams = {}) {
    super(message);
    this.devMessage = devMessage;
    this.httpStatus = httpStatus;
    this.details = details;
  }
  defaultMessage = 'Unknown error';
  defaultHttpStatus = INTERNAL_SERVER_ERROR;
  devMessage?: string;
  httpStatus: number;
  details?: any;
}

export class RouteNotFoundError extends BaseError {
  defaultMessage = 'Route not found';
  defaultHttpStatus = NOT_FOUND;
}
