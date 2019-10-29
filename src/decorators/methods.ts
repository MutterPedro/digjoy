import { ObjectSchema } from '@hapi/joi';
import 'reflect-metadata';

import { HttpMethods } from '../constants/HttpMethods';
import { Metadatas } from '../constants/Metadatas';

function createMethodHandler(method: HttpMethods, path: string, schema?: ObjectSchema) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(Metadatas.Path, path, target, propertyKey);
    Reflect.defineMetadata(Metadatas.Schema, schema, target, propertyKey);
    Reflect.defineMetadata(Metadatas.Method, method, target, propertyKey);
  };
}

export const GET = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.GET, path, schema);
export const PATCH = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.PATCH, path, schema);
export const POST = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.POST, path, schema);
export const PUT = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.PUT, path, schema);
export const OPTIONS = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.OPTIONS, path, schema);
export const CONNECT = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.CONNECT, path, schema);
export const TRACE = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.TRACE, path, schema);
export const HEAD = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.HEAD, path, schema);
export const DELETE = (path: string, schema?: ObjectSchema) => createMethodHandler(HttpMethods.DELETE, path, schema);
