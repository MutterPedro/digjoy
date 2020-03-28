import bodyParser from 'body-parser';
import express from 'express';
import 'reflect-metadata';

import { Metadatas } from './constants/Metadatas';
import { router } from './decorators/controller';

const app = express();
export function controllerSetup(options: { debug?: boolean; bodyLimit?: number | string } = {}) {
  app.use(bodyParser.json({ limit: options.bodyLimit }));
  if (options.debug) {
    Reflect.defineMetadata(Metadatas.DigjoyDebug, true, global);
  }

  app.use(router);

  return app;
}

export { router as Routes };
export * from './decorators/methods';
export { Controller } from './decorators/controller';
