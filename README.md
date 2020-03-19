# digjoy

Simple Typescript decorators for express routing with joi validation

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Build Status](https://travis-ci.org/MutterPedro/digjoy.svg?branch=master)](https://travis-ci.org/MutterPedro/digjoy)
[![Coverage Status](https://coveralls.io/repos/github/MutterPedro/digjoy/badge.svg?branch=master)](https://coveralls.io/github/MutterPedro/digjoy?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/a38ac8458647c365a2c3/maintainability)](https://codeclimate.com/github/MutterPedro/digjoy/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/MutterPedro/digjoy/badge.svg?targetFile=package.json)](https://snyk.io/test/github/MutterPedro/digjoy?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/MutterPedro/digjoy.svg)](https://greenkeeper.io/)

## Installing

```shell script
npm i -S digjoy
```

## Motivation

Digjoy was inspired initially on the java framework **Spring MVC**, it uses **Typescript** decorators like the old **Java annotations** to define the routes and methods. You may think _"just another controller framework, why should I use it? There is many other with thousands of stars on GitHub..."_. Well, in fact, it is another controller framework, but it is a very opinionated one, as I see it, it is very easy to use, very straightforward and needs almost no configuration (things that I usually take into account to choose a library). It is ideal for simple APIs, when you just need to define some routes and validate the request body.

## Why this weird name?

Digjoy uses [Joi](https://hapi.dev/family/joi/?v=16.1.7) to make the request body object validation and every Brazilian 90's children know this [song](https://www.youtube.com/watch?v=9RcN6uMnWkc). I don't know why, but every time I hear the word "joi" or use it on code, I remember that great song. If you didn't know that song, feel free to enjoy this masterpiece for a while 😊.

## How to use it?

Digjoy exclusively counts on **Typescript decorators**. So to use it, basically you need to use its decorators then import the controller files in your app entry point. On your controllers definitions, use the **Controller** decorator:

```typescript
import { Controller } from 'digjoy';

@Controller('/example')
class Example {}

// it also support express middlewares
@Controller('/example2', middleware1, middleware2)
class Example2 {}
```

To define some routes, it is simple just like before. You just need to use the **HTTP methods decorators** above the controller methods. If you need to validate the request body, just pass a **Joi schema object** as the second parameter. If the params `( query field for GET requests or body field for rest methods)` don't follow the schema definition, it will throw a [ValidationError](https://hapi.dev/family/joi/?v=16.1.7#validationerror).

**Attention**: your route handlers won't deal with **request** and **response** objects from express. The parameters will arrive as the function's arguments, and to respond to the request you just need to **return** or **throw** something. Example:

```typescript
import joi from '@hapi/joi';
import { Controller, GET } from 'digjoy';

const paramsSchema = joi.object({
  a: joi.number(),
  b: joi.number(),
});

@Controller('/example')
class Example {
  @GET('/foo')
  private bar() {
    return 'foo bar';
  }

  @GET('/sum', paramsSchema)
  private sum({ a, b }: { a: number; b: number }) {
    return a + b;
  }
}
```

Digjoy supports **all HTTTP methods** in the same fashion. You just to be aware that when you will be using a **GET** route, the parameters should be sent as **query strings**. The other methods (POST, PUT, HEAD, etc), you should send the parameters as the request body.

The last, but crucial, step is to initialize digjoy. You just need to import the function **controllerSetup**, run it, and import the controllers definitions files. Example:

```typescript
import { controllerSetup } from 'digjoy';

import './path/to/contollers';

const app = controllerSetup();
```

The init function **controllerSetup** accept an options object as parameters. Which have the fields **debug** (boolean for debugging logs propose) and **bodyLimit** (for body size limit definition, it follows **body-parser** rules). Also **controllerSetup** return an **express app instance**, which you can use as normal express app to plug in middlewares and extras routes.

```typescript
import { controllerSetup } from 'digjoy';

import './path/to/contollers';

const app = controllerSetup({ debug: true });
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if ((error as ValidationError).details) {
    res.status(BAD_REQUEST).send(error.message);
  } else {
    res.status(error.status || INTERNAL_SERVER_ERROR).send(error.message);
  }
};
app.use(errorHandler);

app.listen(3000);
```

## Running the tests

Normal tests:

```shell script
npm run test
```

Tests with file watch:

```shell script
npm run test:tdd
```

Coverage test

```shell script
npm run test:coverage
```

## Building

```shell script
npm run build
```

## Built With

- Typescript
- Reflect Metadata

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/MutterPedro/digjoy/tags).

## Authors

- **Pedro Mutter** - _Initial work_ - [MutterPedro](https://github.com/MutterPedro)

See also the list of [contributors](https://github.com/mutterpedro/digjoy/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Next Steps

- [x] Support to in route params: `GET /user/:id`
- [ ] Support to route specific middleware
- [ ] Better documentation
- [ ] Helpful utilities
