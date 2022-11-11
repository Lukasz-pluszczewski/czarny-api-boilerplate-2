import { Routes } from '../simple-express-types';
import standard from './standard';
import example from './example';

const routes: Routes[] = [
  ['/example', example],
  standard,
];

export default routes;
