
# TS-CLI

A simple CLI tools to generate files in typescript both Back end (with NestJS) and Front End (with Angular).

Using this CLI you can generate files containning code ready to run as well as unit tested.

You can generate models, services and controllers. Each comes with a class (added to the module when necessary), one or more unit tests files and mocks.

By default, a logger is introduced and, if not exist, a simple version of the logger is created.

## Install

In your terminal run

```
npm link
```

## Example

### Back End

```
$ nestjs new dummy-nestjs
$ cd dummy-nestjs
$ npm install --save mongoose
$ npm install --save-dev  @types/mongoose @nestjs/mongoose @nestjs/swagger
$ ts-cli
$ npm run test:watch
```

You can now access the TS-CLI from anywhere on your station.

## Help

# Sources

