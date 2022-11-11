declare module 'simple-express-framework' {
  import { ISimpleExpressConfig, ISimpleExpressResult } from './simple-express-types';

  export default function simpleExpress(
    simpleExpressConfig: ISimpleExpressConfig
  ): Promise<ISimpleExpressResult>;
}
