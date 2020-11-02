
# TS-CLI

A simple CLI tools to generate human readable files in typescript both Back end (with NestJS) and Front End (with Angular) based on template files.

Using this CLI you can generate files containning code ready to run as well as unit tested.

You can generate models, services and controllers. Each comes with a class (added to the module when necessary), one or more unit tests files and mocks. UI elements can also be created with a page dedicated to a model and widget to list, create and update element in database.

By default, a logger is introduced at different levels and, if not exist, a simple version of the logger is created.

This tools should be used to easily deploy simple API framework.

The tool will also adds the dependencies in app-module files.

## Install

In your terminal run

```bash
npm link
```

You can now access the TS-CLI from anywhere on your station.

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
cd dummy-angular # Note, we point the main moddule.app file
ng add @angular/material
npm install
ts-cli
```

Note: you need to add the following Module to your main app.module: MatCardModule, MatTableModule.

## Help

# Sources

# TODOs

- paginated pages and API
- switch Models_NAME -> MODEL_Names, etc.
- makes the index.js in typescript
- parse a model files and introduce properties in templates
