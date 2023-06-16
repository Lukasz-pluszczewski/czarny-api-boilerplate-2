import { Handler } from 'simple-express-framework';
import { RouteParams } from '../types';

const checkPassword: (password: string) => Handler<RouteParams> = password => ({ next, getHeader }) => {
  if (getHeader('authentication') === password || !password) {
    return next();
  }
  return {
    status: 401,
    body: { message: 'Password incorrect' },
  };
};

export default checkPassword;
