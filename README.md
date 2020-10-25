
# TS-CLI

A simple CLI tools to generate files in typescript both Back end (with NestJS) and Front End (with Angular).

Current version contains only BE.

Using this CLI you can generate files containning code ready to run as well as unit tested.

You can generate models, services and controllers. Each comes with a class (added to the module when necessary), one or more unit tests files and mocks.

By default, a logger is introduced and, if not exist, a simple version of the logger is created.

This tools should be used to easily deploy simple API management.

## Install

In your terminal run

```bash
npm link
```

## Example

### Back End

```bash
nestjs new dummy-nestjs
cd dummy-nestjs
npm install --save mongoose
npm install --save-dev @types/mongoose @nestjs/mongoose @nestjs/swagger
npm run test:watch
ts-cli
```

### Front End

```bash
ng new dummy-angular
cd dummy-angular/src/app
npm install
```

You can now access the TS-CLI from anywhere on your station.

## Help

# Sources

# TODOs

- front end
- parse a model files and introduce properties in templates
- makes the index.js in typescript
