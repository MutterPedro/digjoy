import joi, { ObjectSchema } from '@hapi/joi';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import supertest from 'supertest';
import { OK } from 'http-status';
import 'reflect-metadata';

import { Controller, controllerSetup, GET } from '../src';
import { HttpMethod } from '../src/constants/HttpMethods';
import { Metadatas } from '../src/constants/Metadatas';
import logger from '../src/utils/logger';

chai.use(sinonChai);

describe('Controller without interceptor', () => {
  @Controller('test')
  class ControllerTest {
    @GET(
      'path1',
      joi.object({
        a: joi
          .number()
          .min(1)
          .max(10)
          .integer(),
        b: joi.string(),
      }),
    )
    async testGet({ a, b }: { a: number; b: string }) {
      logger.info(a.toString());
      logger.info(b.toString());
    }
  }

  const app = controllerSetup({ debug: true });

  let loggerSpy: sinon.SinonSpy;
  beforeEach(() => {
    loggerSpy = sinon.spy(logger, 'info');
  });

  afterEach(() => {
    loggerSpy.restore();
  });

  it('should have the correct metadata', () => {
    const method: HttpMethod = Reflect.getMetadata(Metadatas.Method, ControllerTest.prototype, 'testGet');
    const schema: ObjectSchema = Reflect.getMetadata(Metadatas.Schema, ControllerTest.prototype, 'testGet');
    const path: string = Reflect.getMetadata(Metadatas.Path, ControllerTest.prototype, 'testGet');

    expect(method).to.be.eq('get');
    expect(schema).to.be.an('object');
    expect(path).to.be.eq('path1');
  });

  it('should log the correct params', done => {
    supertest(app)
      .get('/test/path1')
      .query({ a: 5, b: 'hello world' })
      .set('Content-type', 'application/json')
      .expect(OK)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(loggerSpy).to.be.calledTwice;
        expect(loggerSpy).to.be.calledWith('5');
        expect(loggerSpy).to.be.calledWith('hello world');

        done();
      });
  });
});
