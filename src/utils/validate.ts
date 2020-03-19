import joi from '@hapi/joi';
import { RequestHandler } from 'express';
import { OK } from 'http-status';

import { HttpMethods } from '../constants/HttpMethods';
import { isDebug } from './environment';
import logger from './logger';

export function validateHandler(handler: Function, paramsModel?: joi.ObjectSchema): RequestHandler {
  return async (req, res, next) => {
    try {
      const bodyOrQuery: 'body' | 'query' = req.method.toLocaleLowerCase() === HttpMethods.GET ? 'query' : 'body';
      const params = { ...req[bodyOrQuery], ...req.params };

      /* istanbul ignore else */
      if (isDebug()) {
        logger.debug(`${req.method} ${req.url} received with params: ${JSON.stringify(params || {})}`);
      }

      if (paramsModel) {
        const validation = paramsModel.validate(params);
        if (validation.error) {
          next(validation.error);
          return;
        }
      }

      const result = await handler(params);
      res.status(OK).send(result);
    } catch (e) {
      next(e);
    }
  };
}
