/* tslint:disable:function-name */
import 'reflect-metadata';
import { ObjectSchema } from 'joi';
import { RequestHandler, Router } from 'express';
import { join } from 'path';

import { HttpMethod } from '../constants/HttpMethods';
import { Metadatas } from '../constants/Metadatas';
import { PRODUCTION } from '../utils/environment';
import logger from '../utils/logger';
import { validateHandler } from '../utils/validate';

export const router = Router();

export function Controller(route: string, ...interceptors: RequestHandler[]) {
  return (constructor: Function) => {
    Object.keys(constructor.prototype).forEach((key) => {
      const handler = constructor.prototype[key];
      if (typeof handler === 'function' && Reflect.hasMetadata(Metadatas.Method, constructor.prototype, key)) {
        const method: HttpMethod = Reflect.getMetadata(Metadatas.Method, constructor.prototype, key);
        const schema: ObjectSchema = Reflect.getMetadata(Metadatas.Schema, constructor.prototype, key);
        const path: string = Reflect.getMetadata(Metadatas.Path, constructor.prototype, key);

        const fullRoute = join('/', route, path);
        router[method](fullRoute, ...interceptors, validateHandler(handler, schema));

        /* istanbul ignore else */
        if (!PRODUCTION) {
          logger.debug(`${method.toUpperCase()} ${fullRoute} handler created`);
        }
      }
    });
  };
}
