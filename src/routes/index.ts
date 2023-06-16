import { Routes } from 'simple-express-framework';
import standard from './standard';
import example from './example';
import { RouteParams } from '../types';

const routes: Routes<RouteParams>[] = [
  ['/example', example],
  standard,
];

export default routes;
