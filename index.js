#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const qGeneral = [{
  name : 'path',
  type : 'input',
  message : 'path to generate the files',
  default : '.',
}];

const qEnd = [
  {
    name: 'end',
    type: 'input',
    message: `Which 'End' BE|fe `,
    default: 'fe',
    validate: function( value ) {
      if (value.toLowerCase() === 'fe' || value.toLowerCase() === 'be') {
        return true;
      } else {
        return `Possible choices are 'fe' or 'be' only. Default: be, you entered: ${value}`;
      }
    }
  },
];

/**
 * Back End types and CLI questions
 */
const availableTypes = ['service', 's', 'model', 'm', 'controller', 'c'];
const qBE = [
  {
    name: 'type',
    type: 'input',
    message: `What type of file: 'model'`,
    default: 'model',
    validate: (value) => {
      if (availableTypes.indexOf(value) !== -1) {
        return true;
      } else {
        return `Possible choices are 'model', 'service' and 'constroller'`;
      }
    },
  },
  {
    name: 'modelName',
    type: 'input',
    message: `What the name of the ressource?`,
    default: 'actor',
    validate: (value) => {
      if (value.trim().length === 0) {
        return 'You need to specify a name for the ressource'
      }
      return true;
    },
  }
];

/**
 * Front End types and CLI questions
 */
const feAvailableTypes = ['model', 'm', 'service', 's', 'listPage', 'lp'];
const qFE = [
  {
    name: 'type',
    type: 'input',
    message: 'What is the type of file?',
    default: 'page',
    valide: (value) => {
      if (feAvailableTypes.indexOf(value) !== -1) {
        return true;
      }
      return `Possible choices are: 'model' (m), 'service' (s) and 'listPage' (lp)'`
    }
  },
  {
    name: 'modelName',
    type: 'input',
    message: 'What is the name of the ressource?',
    default: 'actor',
    validate: (value) => {
      if (value.trim().length === 0) {
        return 'You need to specify a name of the ressource';
      }
      return true;
    }
  }
];

let PATH = process.env.CLIPATH || process.cwd();

/**
 * DEBUG
 */
// PATH += '..\\..\\test\\dummy-nestjs\\src';
/**
 * // DEBUG
 */
//console.log(`\n>> Current index.js directory: ${__dirname}\n`);
const templatePath = path.join(__dirname, 'templates');
const templates = [];
// main function
const run = async () => {
  
  try {
    let data = {};
    let generateDatabaseProvider = false;
    let addLogger = false;
    const aGeneral = await inquirer.prompt(qGeneral);
    const $path = PATH; // path.join(PATH, aGeneral.path);
    console.log(`path: ${$path}`);
    const aEnd = await inquirer.prompt(qEnd);
    data.end = {
      name: aEnd.end
    };
    if (data.end.name === 'be') {
      // Back End: NestJS
      
      // collect data
      const aBE = await inquirer.prompt(qBE);
      const _name = aBE.modelName.trim().toLowerCase();
      data.end.path = 'back-end';
      data.database = {
        name: 'mongodb',
        dbName: 'myproject', // @TODO find better name 
      };
      data.type = {
        name: aBE.type,
      };
      data.names = {
        input: aBE.modelName,
        name: _name,
        names: _name + 's',
        Name: _name.slice(0, 1).toUpperCase() + _name.slice(1, _name.length),
        Names: _name.slice(0, 1).toUpperCase() + _name.slice(1, _name.length) + 's',
        NAME: _name.toUpperCase(),
        NAMES: _name.toUpperCase() + 'S', 
      };
      if (data.type.name === 'model' || data.type.name === 'm') {
        // the buisness model
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `model.buisness.template.txt`)).toString(),
          path: path.join($path, `models`),
          fileName: `${data.names.name}.model.ts`,
        });
        // the dto model
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `dto.template.txt`)).toString(),
          path: path.join($path, `dto`),
          fileName: `${data.names.name}.dto.ts`,
        });
        // the mapper files (class + unit tests + mock data files)
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `mapper.template.txt`)).toString(),
          path: path.join($path, 'mappers'),
          fileName: `${data.names.name}.mapper.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `mapper.template.spec.txt`)).toString(),
          path: path.join($path, 'mappers'),
          fileName: `${data.names.name}.mapper.spec.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `mock.data.txt`)).toString(),
          path: path.join(path.join($path, 'test'), 'data'),
          fileName: `${data.names.name}.mock.data.ts`,
        });
        // the schema and unit tests
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `${data.database.name}`), `schema.template.txt`)).toString(),
          path: path.join($path, 'dbo'),
          fileName: `${data.names.name}.schema.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `${data.database.name}`), `schema.template.spec.txt`)).toString(),
          path: path.join($path, 'dbo'),
          fileName: `${data.names.name}.schema.spec.ts`,
        });
        // the provider to inject in appModule
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `${data.database.name}`), `model.provider.template.txt`)).toString(),
          path: path.join($path, 'providers'),
          fileName: `${data.names.names}.providers.ts`,
        });
        // if database provider does not exist, creates it
        if (!fs.existsSync(path.join(path.join($path, 'providers'), 'database.provider.ts'))) {
          templates.push({
            file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `providers`), `database.provider.template.txt`)).toString(),
            path: path.join($path, 'providers'),
            fileName: `database.providers.ts`,
          });
          generateDatabaseProvider = true;
        }
        // generate the mock of the model for service unit test
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), `models`), `${data.database.name}`), `model.mock.template.txt`)).toString(),
          path: path.join($path, 'test/mock'),
          fileName: `${data.names.name}.mock.model.ts`,
        });
      } else if (data.type.name === 'service' || data.type.name === 's') {
        // the service and unit tests
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `services`), `service.template.txt`)).toString(),
          path: path.join($path, 'services'),
          fileName: `${data.names.name}.service.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `services`), `service.template.spec.txt`)).toString(),
          path: path.join($path, 'services'),
          fileName: `${data.names.name}.service.spec.ts`,
        });
        // generate the mock of the service for controller unit test
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `services`), `service.mock.template.txt`)).toString(),
          path: path.join($path, 'test/mock'),
          fileName: `${data.names.name}.mock.service.ts`,
        });
        // if the logger is not does not exist, then creates it
        if (!fs.existsSync(path.join($path, `tools/logger/logger.ts`))) {
          addLogger = true;
          templates.push({
            file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'tools'), 'logger.template.txt')).toString(),
            path: path.join($path, 'tools/logger'),
            fileName: 'logger.ts',
          });
        }
        // if the mock of the logger does not exist, then creates it
        if (!fs.existsSync(path.join($path, `test/mock/logger.mock.ts`))) {
          templates.push({
            file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `tools`), `logger.mock.template.txt`)).toString(),
            path: path.join($path, `test/mock`),
            fileName: `logger.mock.ts`,
          });
        }
      } else if (data.type.name === 'controller' || data.type.name === 'c') {
        // the service and unit tests
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `controllers`), `controller.template.txt`)).toString(),
          path: path.join($path, 'controllers'),
          fileName: `${data.names.name}.controller.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `controllers`), `controller.template.spec.txt`)).toString(),
          path: path.join($path, 'controllers'),
          fileName: `${data.names.name}.controller.spec.ts`,
        });
        // if the logger is not does not exist, then creates it
        if (!fs.existsSync(path.join($path, `tools/logger/logger.ts`))) {
          addLogger = true;
          templates.push({
            file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'tools'), 'logger.template.txt')).toString(),
            path: path.join($path, 'tools/logger'),
            fileName: 'logger.ts',
          });
        }
        // if the mock of the logger does not exist, then creates it
        if (!fs.existsSync(path.join($path, `test/mock/logger.mock.ts`))) {
          templates.push({
            file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), `tools`), `logger.mock.template.txt`)).toString(),
            path: path.join($path, `test/mock`),
            fileName: `logger.mock.ts`,
          });
        }
      }
    } else if(data.end.name === 'fe') {
      // Front End: Angular
      // collect data
      const aFE = await inquirer.prompt(qFE);
      data.end.path = 'front-end';
      data.type = {
        name: aFE.type,
      };
      console.log(data);
      const _name = aFE.modelName.trim().toLowerCase();
      data.names = {
        input: aFE.modelName,
        name: _name,
        names: _name + 's',
        Name: _name.slice(0, 1).toUpperCase() + _name.slice(1, _name.length),
        Names: _name.slice(0, 1).toUpperCase() + _name.slice(1, _name.length) + 's',
        NAME: _name.toUpperCase(),
        NAMES: _name.toUpperCase() + 'S', 
      };
      // -- manage the model --
      if (data.type.name === 'model' || data.type.name === 'm') {
        // create a single model file
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'models'), 'model.template.txt')).toString(),
          path: path.join(path.join(path.join($path,'src'), 'app'), `models`),
          fileName: `${data.names.name}.ts`,
        });
        // create a mock data
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'models'), 'model.mock.template.txt')).toString(),
          path: path.join(path.join(path.join($path,'src'), 'test'), 'mock'),
          fileName: `${data.names.name}.mock.ts`,
        });
      }
      // -- manage the service --
      if (data.type.name === 'service' || data.type.name === 's') {
        // the service
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'service'), 'service.template.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'services'), `${data.names.name}`),
          fileName: `${data.names.names}.service.ts`,
        });
        // the tests
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'service'), 'service.test.template.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'services'), `${data.names.name}`),
          fileName: `${data.names.names}.service.spec.ts`,
        });
      }
      // -- manage the page --
      if (data.type.name === 'page' || data.type.name === 'p') {
        // the main page
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'pages'), 'models-component'), 'model.component.template.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'pages'), `${data.names.names}-page`),
          fileName: `${data.names.names}.component.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'pages'), 'models-component'), 'model.component.template.html.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'pages'), `${data.names.names}-page`),
          fileName: `${data.names.names}.component.html`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'pages'), 'models-component'), 'model.component.template.scss.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'pages'), `${data.names.names}-page`),
          fileName: `${data.names.names}.component.scss`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'pages'), 'models-component'), 'model.component.template.test.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'pages'), `${data.names.names}-page`),
          fileName: `${data.names.names}.component.spec.ts`,
        });
        // the table widget
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'models-list'), 'models-list.component.template.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-list`),
          fileName: `${data.names.names}-list.component.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'models-list'), 'models-list.component.template.html.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-list`),
          fileName: `${data.names.names}-list.component.html`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'models-list'), 'models-list.component.template.scss.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-list`),
          fileName: `${data.names.names}-list.component.scss`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'models-list'), 'models-list.component.template.test.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-list`),
          fileName: `${data.names.names}-list.component.spec.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'models-list'), 'models-list.datasource.template.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-list`),
          fileName: `${data.names.names}-list.datasource.ts`,
        });
        // the creation/update form widget
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'model-form'), 'models-form.component.template.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-form`),
          fileName: `${data.names.names}-form.component.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'model-form'), 'models-form.component.template.html.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-form`),
          fileName: `${data.names.names}-form.component.html`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'model-form'), 'models-form.component.template.scss.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-form`),
          fileName: `${data.names.names}-form.component.scss`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(path.join(templatePath, `${data.end.path}`), 'widgets'), 'model-form'), 'models-form.component.template.test.txt')).toString(),
          path: path.join(path.join(path.join(path.join($path,'src'), 'app'), 'widgets'), `${data.names.names}-form`),
          fileName: `${data.names.names}-form.component.spec.ts`,
        });
      }
    }

    // console.log(templates);

    // files generation
    console.log(`files generation ...`);
    for(const template of templates) {
      if ( !fs.existsSync(template.path) ) {
        fs.mkdirSync(template.path, { recursive: true });
      }
      let text = template.file;
      text = text.replace(/%model_NAME%/g, data.names.name);
      text = text.replace(/%models_NAME%/g, data.names.names);
      text = text.replace(/%Model_NAME%/g, data.names.Name);
      text = text.replace(/%Models_NAME%/g, data.names.Names);
      text = text.replace(/%MODEL_NAME%/g, data.names.NAME);
      text = text.replace(/%MODELS_NAME%/g, data.names.NAMES);
      if (data.end.name === 'be') {
        text = text.replace(/%DATABASE_NAME%/g, data.database.dbName);
      }
      fs.writeFileSync(path.join(template.path, template.fileName), text);
    }
    console.log(`... files generation done`);
    console.log(`appModule modifications ...`);
    // add the dependencies to the App module
    if ( data.end.name === 'be') {
      let strToFind;
      let strToFindInMain = [];
      const appModule = fs.readFileSync(path.join($path, 'app.module.ts')).toString();
      const mainFile = fs.readFileSync(path.join($path, 'main.ts')).toString();
      let strToAddImport;
      let strToAddDependencies;
      let strToAddImportInMain = [];
      let strToAddDependenciesInMain;
      let shiftInMain = [];
      
      if (data.type.name === 'model' || data.type.name === 'm') {
        strToFind = `providers: [`;
        strToAddImport =`\n\t\t... ${data.names.Names}Providers,`;
        strToAddDependencies = `import { ${data.names.Names}Providers } from './providers/${data.names.names}.providers';\n`;
        if (generateDatabaseProvider) {
          strToAddImport = `\n\t\t... databaseProviders,` + strToAddImport;
          strToAddDependencies = `import { databaseProviders } from './providers/database.providers';\n` + strToAddDependencies;
        }
        
      } else if (data.type.name === 'service' || data.type.name === 's') {
        strToFind = `providers: [`;
        strToAddImport =`\n\t\t${data.names.Names}Service,`;
        strToAddDependencies = `import { ${data.names.Names}Service } from './services/${data.names.name}.service';\n`;
        if (addLogger) {
          strToFindInMain = [`AppModule);`, `AppModule)`];
          shiftInMain = [0, -1];
          strToAddImport +=`\n\t\tLogger,`;
          strToAddDependencies += `import { Logger } from './tools/logger/logger';\n`;
          strToAddImportInMain = [
            `\n\tapp.useLogger(new Logger());`,
            `, {\n\t\tlogger: ['warn', 'error', 'log', 'debug', 'verbose'],\n\t}`
          ];
          strToAddDependenciesInMain = `import { Logger } from './tools/logger/logger';\n`;
        }
      } else if (data.type.name === 'controller' || data.type.name === 'c') {
        strToFind = `controllers: [`;
        strToAddImport =`\n\t\t${data.names.Names}Controller,`;
        strToAddDependencies = `import { ${data.names.Names}Controller } from './controllers/${data.names.name}.controller';\n`;
      }
      const index = appModule.indexOf(strToFind);
      if (index >= 0) {
        // modify the file
        // add new element to module
        let newAppModule = appModule;
        if (newAppModule.indexOf(strToAddImport.trim()) === -1) {
          newAppModule = appModule.slice(0, index + strToFind.length) +
            strToAddImport +
            appModule.slice(index + strToFind.length, appModule.length);
        }
        // add the dependencies
        // look for the last import line
        let indexImport = newAppModule.lastIndexOf('import {');
        indexImport = newAppModule.indexOf('\n', indexImport);
        if (newAppModule.indexOf(strToAddDependencies.trim()) === -1) {
          newAppModule = newAppModule.slice(0, indexImport + 1) + 
            strToAddDependencies +
            newAppModule.slice(indexImport, newAppModule.length);
        }
        // write the new 'app.module' file
        fs.writeFileSync(path.join($path, 'app.module.ts'), newAppModule);
      }
      // update main file
      let i = 0;
      let newMain = mainFile;
      for (i = 0; i < strToFindInMain.length; i++) {
        const index = mainFile.indexOf(strToFindInMain[i]);
        if (index >= 0) {
          if (newMain.indexOf(strToAddImportInMain[i].trim()) === -1) {
            newMain = newMain.slice(0, index + strToFindInMain[i].length + shiftInMain[i]) +
              strToAddImportInMain[i] +
              newMain.slice(index + strToFindInMain[i].length + shiftInMain[i], newMain.length);
          }
        }
      }
      // add the dependencies
      // look for the last import line
      let indexImport = newMain.lastIndexOf('import {');
      indexImport = newMain.indexOf('\n', indexImport);
      if (strToAddDependenciesInMain && strToAddDependenciesInMain.length > 0) {
        if (newMain.indexOf(strToAddDependenciesInMain.trim()) === -1) {
          newMain = newMain.slice(0, indexImport + 1) + 
            strToAddDependenciesInMain +
            newMain.slice(indexImport, newMain.length);
        }
      }    
      // write the new 'main.ts' file
      fs.writeFileSync(path.join($path, 'main.ts'), newMain);
      console.log(`... appModule modifications done`);
    }
    // add the dependencies to the App Module
    if (data.end.name === 'fe') {
      // add the API_URL to the app.module
      const appModulePath = path.join(path.join(path.join($path, 'src'), 'app'), 'app.module.ts');
      let appModule = fs.readFileSync(appModulePath).toString();
      let strToFind = '';
      let strToImport = '';
      let strImporting = ''; // will contain the import
      if (data.type.name === 'service' || data.type.name === 's') {
        // parse the appModule and find the provider
        strToFind = 'providers: [';
        strToImport = `\n    { provide: 'API_${data.names.NAMES}_URL', useValue: '/api/${data.names.name}' },`
        if (appModule.indexOf('providers: []') !== -1) {
          strToImport = strToImport + `\n  `;
        }
      } else if (data.type.name === 'page' || data.type.name === 'p') {
        // parse the appModule and find the provider
        strToFind = 'declarations: [';
        strToImport = `\n    ${data.names.Names}ListComponent,\n    ${data.names.Names}Component,\n    ${data.names.Names}FormComponent,`
        if (appModule.indexOf('declarations: []') !== -1) {
          strToImport = strToImport + `\n  `;
        }
        strImporting = `import { ${data.names.Names}Component } from './pages/${data.names.names}-page/${data.names.names}.component';\n`;
        strImporting += `import { ${data.names.Names}ListComponent } from './widgets/${data.names.names}-list/${data.names.names}-list.component';\n`;
        strImporting += `import { ${data.names.Names}FormComponent } from './widgets/${data.names.names}-form/${data.names.names}-form.component';\n`;

      }
      // modify the app.module.ts file
      const index = appModule.indexOf(strToFind);
      let newAppModule = appModule;
      if (index >= 0) {
        // if the app.module does not already contains the string
        if (newAppModule.indexOf(strToImport) === -1) {
          newAppModule = newAppModule.slice(0, index + strToFind.length) +
            strToImport +
            newAppModule.slice(index + strToFind.length, newAppModule.length);
        }
      }
      // the deptendcies at the top of the file
      if (newAppModule.indexOf(strImporting) === -1) {
        newAppModule = strImporting + newAppModule;
      }
      fs.writeFileSync(appModulePath, newAppModule);
    }
  } catch (error) {
    console.log(chalk.red('Error during the process.'));
    console.log(error);
  }
};

clear();
run();

