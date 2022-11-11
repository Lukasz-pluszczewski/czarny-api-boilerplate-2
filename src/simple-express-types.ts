import cors = require('cors');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');

import express = require('express');
import http = require('http');
import https = require('https');

export interface IConfig {
  cors: cors.CorsOptions | cors.CorsOptionsDelegate;
  jsonBodyParser: bodyParser.OptionsJson;
  cookieParser: cookieParser.CookieParseOptions;
}

export interface IRouteParams {
  [paramNam: string]: any;
}

export interface IHandlerParams {
  body: any;
  query: any;
  params: any;
  method: string;
  originalUrl: string;
  protocol: string;
  xhr: boolean;
  getHeader: (x: string) => string;
  get: (x: string) => string;
  locals: object;
  next: (error?: any) => void;
  req: express.Request;
  res: express.Response;
}

export interface IHeaders {
  [headerName: string]: string;
}

export interface IResponseDefinition {
  body?: string | object | Buffer;
  status?: number;
  method?: string;
  redirect?: false | string;
  headers?: IHeaders;
  type?: string;
}

export type Handler = (
  handlerParams: IHandlerParams & IRouteParams
) =>
  | IResponseDefinition
  | Promise<IResponseDefinition>
  | Error
  | void
  | Handler[];
export type ErrorHandler = (
  error: Error | any,
  handlerParams: IHandlerParams & IRouteParams
) =>
  | IResponseDefinition
  | Promise<IResponseDefinition>
  | Error
  | void
  | ErrorHandler[];

export interface IHandlers {
  use?: Handler;

  get?: Handler;
  post?: Handler;
  put?: Handler;
  delete?: Handler;
  del?: Handler;
  options?: Handler;
  patch?: Handler;
  head?: Handler;

  checkout?: Handler;
  copy?: Handler;
  lock?: Handler;
  merge?: Handler;
  mkactivity?: Handler;
  mkcol?: Handler;
  move?: Handler;
  'm-search'?: Handler;
  notify?: Handler;
  purge?: Handler;
  report?: Handler;
  search?: Handler;
  subscribe?: Handler;
  trace?: Handler;
  unlock?: Handler;
  unsubscribe?: Handler;
}

export interface IPathObjectRoutes {
  [path: string]:
    | (Handler | IHandlers | IPathObjectRoutes | IPathObjectRoutes[] | Routes)
    | IPathObjectRoutes[];
}

export interface IObjectRoute {
  path: string;
  handlers?: IHandlers;
  routes?: Routes;
}

export type ArrayOfArraysRest =
  | Routes
  | IHandlers
  | Handler
  | Handler[]
  | ArrayOfArrays
  | ArrayOfArraysRest[];

export type ArrayOfArrays = [string, ...ArrayOfArraysRest[]];

export type Routes =
  | ArrayOfArrays
  | IPathObjectRoutes
  | IObjectRoute
  | Routes[];

export interface ISimpleExpressConfig {
  port?: string | number;
  routes?: Routes;
  middleware?: Handler | Handler[];
  errorHandlers?: ErrorHandler | ErrorHandler[];
  expressMiddleware?: express.Handler[];
  config?: IConfig;
  routeParams?: IRouteParams;
  app?: express.Application;
  server?: http.Server | https.Server;
}

export interface ISimpleExpressResult {
  app: express.Application;
  server: http.Server | https.Server;
}
