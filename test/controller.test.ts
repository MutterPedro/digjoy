import joi, { ObjectSchema, ValidationError } from '@hapi/joi';
import chai, { expect } from 'chai';
import { ErrorRequestHandler } from 'express';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import supertest from 'supertest';
import { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } from 'http-status';
import 'reflect-metadata';

import { CONNECT, Controller, controllerSetup, DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT, TRACE } from '../src';
import { HttpMethod } from '../src/constants/HttpMethods';
import { Metadatas } from '../src/constants/Metadatas';
import logger from '../src/utils/logger';

chai.use(sinonChai);

describe('Controller', () => {
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

    @POST(
      'path2',
      joi.object({
        a: joi.string(),
      }),
    )
    async testPost({ a }: { a: string }) {
      logger.info(a);
    }

    @PUT('path3')
    async testPut() {}

    @PATCH('path4')
    async testPatch() {}

    @HEAD('path5')
    async testHead() {}

    @CONNECT('path6')
    async testConnect() {}

    @TRACE('path7')
    async testTrace() {}

    @DELETE('path8')
    async testDelete() {}

    @OPTIONS('path9')
    async testOptions() {}

    async testNoRoute() {}
  }

  const app = controllerSetup({ debug: true });
  const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if ((error as ValidationError).details) {
      res.status(BAD_REQUEST).send(error.message);
    } else {
      res.status(error.status || INTERNAL_SERVER_ERROR).send(error.message);
    }
  };
  app.use(errorHandler);

  let loggerInfoSpy: sinon.SinonSpy;
  beforeEach(() => {
    loggerInfoSpy = sinon.spy(logger, 'info');
  });

  afterEach(() => {
    loggerInfoSpy.restore();
  });

  it('should have the correct metadata', () => {
    const method: HttpMethod = Reflect.getMetadata(Metadatas.Method, ControllerTest.prototype, 'testGet');
    const schema: ObjectSchema = Reflect.getMetadata(Metadatas.Schema, ControllerTest.prototype, 'testGet');
    const path: string = Reflect.getMetadata(Metadatas.Path, ControllerTest.prototype, 'testGet');

    expect(method).to.be.eq('get');
    expect(schema).to.be.an('object');
    expect(path).to.be.eq('path1');
  });

  describe('GET', () => {
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

          expect(loggerInfoSpy).to.be.calledTwice;
          expect(loggerInfoSpy).to.be.calledWith('5');
          expect(loggerInfoSpy).to.be.calledWith('hello world');

          done();
        });
    });

    it('should complain about wrong parameters', done => {
      supertest(app)
        .get('/test/path1')
        .query({ a: 50, b: 'hello world' })
        .set('Content-type', 'application/json')
        .expect(BAD_REQUEST)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(res.text).to.be.eq(
            `{\n  "b": "hello world",\n  "a" [31m[1][0m: "50"\n}\n[31m\n[1] "a" must be less than or equal to 10[0m`,
          );
          done();
        });
    });
  });

  describe('POST', () => {
    it('should log the correct params', done => {
      supertest(app)
        .post('/test/path2')
        .send({ a: 'hello world' })
        .set('Content-type', 'application/json')
        .expect(OK)
        .end((err, res) => {
          if (err) {
            throw err;
          }

          expect(loggerInfoSpy).to.be.calledOnce;
          expect(loggerInfoSpy).to.be.calledWith('hello world');

          done();
        });
    });
  });
});

describe('Controller with interceptor', () => {
  @Controller('test2', (req, res, next) => {
    logger.info(`Interceptor test...`);
    next();
  })
  // @ts-ignore
  class ControllerTest {
    @GET('path')
    async testGet() {
      logger.info('Get without params');
    }
  }

  const app = controllerSetup();

  let loggerInfoSpy: sinon.SinonSpy;
  beforeEach(() => {
    loggerInfoSpy = sinon.spy(logger, 'info');
  });

  afterEach(() => {
    loggerInfoSpy.restore();
  });

  it('should run the interceptor', done => {
    supertest(app)
      .get('/test2/path')
      .set('Content-type', 'application/json')
      .expect(OK)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(loggerInfoSpy).to.be.calledTwice;
        expect(loggerInfoSpy).to.be.calledWith('Interceptor test...');
        expect(loggerInfoSpy).to.be.calledWith('Get without params');

        done();
      });
  });
});
