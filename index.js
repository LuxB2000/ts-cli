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

const qBE = [
  {
    name: 'type',
    type: 'input',
    message: `What type of file: 'model'`,
    default: 'model',
    validate: (value) => {
      if (value === 'model') {
        return true;
      } else {
        return `Possible choices are 'model'`;
      }
    },
  },
  {
    name: 'modelName',
    type: 'input',
    message: `What the name of the ressource?`,
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
PATH += '..\\..\\test\\dummy-nestjs';
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
      data.end.path = 'nestjs';
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
      if (data.type.name === 'model') {
        // the buisness model
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(`${templatePath}`,`${data.end.path}`),`models`), `model.buisness.template.txt`)).toString(),
          path: path.join($path, `models`),
          fileName: `${data.names.name}.model.ts`,
        });
        templates.push({
          file: fs.readFileSync(path.join(path.join(path.join(`${templatePath}`,`${data.end.path}`),`models`), `dto.template.txt`)).toString(),
          path: path.join($path, `dto`),
          fileName: `${data.names.name}.dto.ts`,
        });
      }
    } else {
      // Front End: Angular
    }

    // console.log(templates);

    // files generation
    for(const template of templates) {
      if ( !fs.existsSync(template.path) ) {
        fs.mkdirSync(template.path);
      }
      let text = template.file;
      text = text.replace('%model_NAME%', data.names.name);
      text = text.replace('%models_NAME%', data.names.names);
      text = text.replace('%Model_NAME%', data.names.Name);
      text = text.replace('%Models_NAME%', data.names.Names);
      text = text.replace('%MODEL_NAME%', data.names.NAME);
      text = text.replace('%MODELS_NAME%', data.names.NAMES);
      fs.writeFileSync(path.join(template.path, template.fileName), text);
    }
  } catch (error) {
    console.log(chalk.red('Error during the process.'));
    console.log(error);
  }
};

clear();
run();

