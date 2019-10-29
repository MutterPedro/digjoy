import joi from '@hapi/joi';
import { RequestHandler } from 'express';
import { BAD_REQUEST, OK } from 'http-status';

import { HttpMethods } from '../constants/HttpMethods';
import { isDebug } from './environment';
import logger from './logger';

export function validateHandler(handler: Function, paramsModel?: joi.ObjectSchema): RequestHandler {
  return async (req, res) => {
    const bodyOrQuery: 'body' | 'query' = req.method.toLocaleLowerCase() === HttpMethods.GET ? 'query' : 'body';
    const params = req[bodyOrQuery];

    if (isDebug()) {
      logger.debug(`${req.method} ${req.url} received with params: ${JSON.stringify(params || {})}`);
    }

    if (paramsModel) {
      const validation = paramsModel.validate(params);
      if (validation.error) {
        res.status(BAD_REQUEST);
        throw new TypeError(validation.error.details.map(e => e.message).join('\n'));
      } else {
        const result = await handler(params);
        res.status(OK);
        res.send(result);
      }
    }
  };
}
