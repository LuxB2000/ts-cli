const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

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
    name: 'name',
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

const run = async () => {
  
  //console.log(credentials);
  try {
    const aEnd = await inquirer.prompt(qEnd);
    console.log('got positive response with');
    console.log(aEnd);
    if (aEnd.end === 'be') {
      // Back End: NestJS
      const aBE = inquirer.prompt(qBE);
    } else {
      // Front End: Angular
    }
  } catch (error) {
    console.log(chalk.red('Error during the process.'));
    console.log(error);
  }
};

clear();
run();

