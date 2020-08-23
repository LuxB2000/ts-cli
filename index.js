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
    default: 'be',
    validate: function( value ) {
      if (value.toLowerCase() === 'fe' || value.toLowerCase() === 'be') {
        return true;
      } else {
        return `Possible choices are 'fe' or 'be' only. Default: be, you entered: ${value}`;
      }
    }
  },
];

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
        return `Possible choices are 'model', 'service'`;
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

let PATH = process.env.CLIPATH || process.cwd();

/**
 * DEBUG
 */
PATH += '..\\..\\test\\dummy-nestjs\\src';
/**
 * // DEBUG
 */

 const templatePath = process.cwd() + '/templates';
 const templates = [];
// main function
const run = async () => {
  
  try {
    let data = {};
    const aGeneral = await inquirer.prompt(qGeneral);
    const $path = path.join(PATH, aGeneral.path);
    console.log(`path: ${$path}`);
    const aEnd = await inquirer.prompt(qEnd);
    data.end = {
      name: aEnd.end
    };
    if (aEnd.end === 'be') {
      // Back End: NestJS
      
      // collect data
      const aBE = await inquirer.prompt(qBE);
      const _name = aBE.modelName.trim().toLowerCase();
      data.end.path = 'back-end';
      data.database = {
        name: 'mongodb',
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
      }
    } else {
      // Front End: Angular
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
      fs.writeFileSync(path.join(template.path, template.fileName), text);
    }
    console.log(`... files generation done`);
    console.log(`appModule modifications ...`);
    // add the dependencies to the App module
    let strToFind;
    const appModule = fs.readFileSync(path.join($path, 'app.module.ts')).toString();
    let strToAddImport;
    let strToAddDependencies;
    if (data.type.name === 'service' || data.type.name === 's') {
      strToFind = `providers: [`;
      strToAddImport =`\n\t\t${data.names.Names}Service,\n`;
      strToAddDependencies = `import { ${data.names.Names}Service } from './services/${data.names.name}.service';\n`;
    } else if (data.type.name === 'controller' || data.type.name === 'c') {
      strToFind = `controllers: [`;
      strToAddImport =`\n\t\t${data.names.Names}Controller,\n`;
      strToAddDependencies = `import { ${data.names.Names}Controller } from './controllers/${data.names.name}.controller';\n`;
    }
    const index = appModule.indexOf(strToFind);
    if (index >= 0) {
      // modify the file
      // add new element to module
      let newAppModule = appModule.slice(0, index + strToFind.length) +
        strToAddImport +
        appModule.slice(index + strToFind.length, appModule.length);
      // add the dependencies
      // look for the last import line
      let indexImport = newAppModule.lastIndexOf('import {');
      indexImport = newAppModule.indexOf('\n', indexImport);
      newAppModule = newAppModule.slice(0, indexImport + 1) + 
        strToAddDependencies +
        newAppModule.slice(indexImport, newAppModule.length);
      // write the new file
      fs.writeFileSync(path.join($path, 'app.module.ts'), newAppModule);
    }
    console.log(`... appModule modifications done`);
  } catch (error) {
    console.log(chalk.red('Error during the process.'));
    console.log(error);
  }

  
};

clear();
run();

