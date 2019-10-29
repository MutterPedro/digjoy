import 'reflect-metadata';

import { Metadatas } from '../constants/Metadatas';

export const isDebug = () => Reflect.getMetadata(Metadatas.DigjoyDebug, global);

export const PRODUCTION = process.env.NODE_ENV === 'production';
