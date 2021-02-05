const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');
const program = require('commander');
const fs = require('fs');
const os = require('os');

// create-react-app
const checkProjectName = (projectName) => {
    if (typeof projectName === 'undefined') {
        console.error('Please specify the project directory:');
        console.log(
            `  ${chalk.cyan(program.name())} ${chalk.green(
                '<project-directory>'
            )}`
        );
        console.log();
        console.log('For example:');
        console.log(
            `  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`
        );
        console.log();
        console.log(
            `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
        );
        process.exit(1);
    }
};

const checkAppDirExists = (root) => {
    try {
        if (fs.existsSync(root)) {
            console.error(`${root} already exist.`);
            console.error(
                'Please change to a different the project directory.'
            );
            process.exit(1);
        }
    } catch (err) {}
};

const alterPackage = (root, appName, packgePath = 'package.json') => {
    const appPackage = require(path.join(root, packgePath));
    appPackage.name = appName;
    fs.writeFileSync(
        path.join(root, packgePath),
        JSON.stringify(appPackage, null, 2) + os.EOL
    );
};

module.exports = (projectName) => {
    checkProjectName(projectName);

    const root = path.resolve(projectName);
    const appName = path.basename(root);

    // checkAppDirExists(root);

    console.log(chalk.white('\n Start generating... \n'));
    const spinner = ora('Downloading...');
    spinner.start();

    download(
        'direct:https://github.com/vuejs/vue.git#dev',
        projectName,
        {
            clone: true,
        },
        (err) => {
            if (err) {
                spinner.fail();
                console.log(chalk.red(`Failed to download repository. ${err}`));
                return;
            }
            spinner.succeed();

            alterPackage(root, appName);

            console.log(chalk.cyan('\n Repository download completed!'));
            console.log(chalk.cyan('\n To get started'));
            console.log(chalk.cyan(`\n    cd ${projectName} \n`));
        }
    );
};
