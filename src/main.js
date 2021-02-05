const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const { version } = require('../package.json');

const COMMAND_SUBDIR = 'command';

const allActions = {
    create: {
        alias: 'c',
        description: 'create a new project',
        examples: ['my-cli create <project-directory>'],
    },
};

Reflect.ownKeys(allActions).forEach((actionName) => {
    program
        .command(actionName)
        .alias(allActions[actionName].alias)
        .description(allActions[actionName].description)
        .action(() => {
            if (actionName === '*') {
                console.error(allActions[actionName].description);
            } else {
                // console.log(actionName);
                // console.log(process.argv);
                // console.log(__dirname);

                const actionModule = require(path.join(
                    __dirname,
                    COMMAND_SUBDIR,
                    actionName
                ));
                actionModule(...process.argv.slice(3));
            }
        });
});

program.on('--help', () => {
    console.log('\nExamples:');
    Reflect.ownKeys(allActions).forEach((actionName) => {
        if (allActions[actionName].examples) {
            allActions[actionName].examples.forEach((example) => {
                console.log(`  ${example}`);
            });
        }
    });
});

program.version(version).parse(process.argv);
