'use strict';
const chalk = require('chalk');
const inquirer = require('inquirer');
const shell = require('shelljs');

const SOURCE_ROOT = process.cwd() + "/sources/";
const PATCH_ROOT = process.cwd() + "/patches";

const LANGUAGE_SERVER = "language-server";
const DOCERINA = "docerina";
const PLUGIN_MAVEN = "plugin-maven";
const COMPOSER = "composer";
const TESTERINA = "testerina";
const CONTAINER_SUPPORT = "container-support";
const TOOL_SWAGGER_BALLERINA = "tool-swagger-ballerina";
const TOOLS_DISTRIBUTION = "tools-distribution";

const COMMIT_MSG = "Revert property value";

const WELCOME_MSG = ` _           _ _           _             
| |         | | |         (_)            
| |__   __ _| | | ___ _ __ _ _ __   __ _ 
| '_ \\ / _\` | | |/ _ \\ '__| | '_ \\ / _\` |
| |_) | (_| | | |  __/ |  | | | | | (_| |
|_.__/ \\__,_|_|_|\\___|_|  |_|_| |_|\\__,_|\n

#########################################
### Welcome to Ballerina Repo Manager ###
#########################################\n`;
console.log(chalk.bold.blue(WELCOME_MSG));

console.log(chalk.yellow("Makes snapshot version updating easier by updating release branch :)\n"));

inquirer
    .prompt([
        {
            type: 'input',
            name: 'version',
            message: "Enter Ballerina version (x.x.x): ",
            validate: function (value) {
                var pass = value.match(
                    /^\d+\.\d+.\d$/i
                );
                if (pass) {
                    return true;
                }
                return 'Please enter a valid version (in x.x.x format)';
            }
        },
        {
            type: 'checkbox',
            name: 'repositories',
            message: 'Select repositories:',
            choices: [
                {
                    name: LANGUAGE_SERVER,
                    value: LANGUAGE_SERVER,
                    checked: true
                }, {
                    name: DOCERINA,
                    value: DOCERINA,
                    checked: true
                }, {
                    name: PLUGIN_MAVEN,
                    value: PLUGIN_MAVEN,
                    checked: true
                }, {
                    name: COMPOSER,
                    value: COMPOSER,
                    checked: true
                }, {
                    name: TESTERINA,
                    value: TESTERINA,
                    checked: true
                }, {
                    name: CONTAINER_SUPPORT,
                    value: CONTAINER_SUPPORT,
                    checked: true
                }, {
                    name: TOOL_SWAGGER_BALLERINA,
                    value: TOOL_SWAGGER_BALLERINA,
                    checked: true
                }, {
                    name: TOOLS_DISTRIBUTION,
                    value: TOOLS_DISTRIBUTION,
                    checked: true
                }
            ]
        }, {
            type: 'confirm',
            name: 'createPullRequests',
            message: 'Do you want to create pull requests?',
            default: false
        }
    ])
    .then(answers => {
        // console.log(JSON.stringify(answers, null, '  '));
        if (!shell.which('git')) {
            shell.echo(chalk.red("Sorry, this script requires 'git' (https://git-scm.com/downloads)."));
            return;
        }

        if (answers.createPullRequests && !shell.which('hub')) {
            shell.echo(chalk.red("Sorry, this script requires 'hub' (https://hub.github.com)."));
            return;
        }

        for (let i = 0; i < answers.repositories.length; i++) {
            processRepo(answers.repositories[i], answers.version, answers.createPullRequests);
        }
    });

let processRepo = function (repository, version, createPullRequests) {

    console.log(chalk.blue("\nProcessing ") + chalk.bold.blue(repository));

    switch (repository) {
        case LANGUAGE_SERVER:
            processLanguageServer(version, createPullRequests);
            break;
        case DOCERINA:
            processDocerina(version, createPullRequests);
            break;
        case PLUGIN_MAVEN:
            processPluginMaven(version, createPullRequests);
            break;
        case COMPOSER:
            processComposer(version, createPullRequests);
            break;
        case TESTERINA:
            processTesterina(version, createPullRequests);
            break;
        case CONTAINER_SUPPORT:
            processContainerSupport(version, createPullRequests);
            break;
        case TOOL_SWAGGER_BALLERINA:
            processToolsSwaggerBallerina(version, createPullRequests);
            break;
        case TOOLS_DISTRIBUTION:
            processToolsDistribution(version, createPullRequests);
            break;
    }
};

let executeCommand = function (command) {
    let response = shell.exec(command);
    if (response.code !== 0) {
        console.log(chalk.bold.red(command) + chalk.red(" failed. Skipping the repository."));
        return false;
    }
    return true;
};

let fetchUpstream = function () {
    console.log(chalk.blue(`\nFetching upstream`));
    let command = "git fetch upstream";
    return executeCommand(command);
};

let checkoutBranch = function (branch) {
    console.log(chalk.blue("\nChecking out branch: ") + chalk.bold.blue(branch));
    let command = `git checkout ${branch}`;
    return executeCommand(command);
};

let checkPatch = function (location) {
    console.log(chalk.blue("\nChecking patch: ") + chalk.bold.blue(location));
    let command = `git apply --check ${location}`;
    return executeCommand(command);
};

let applyPatch = function (location) {
    console.log(chalk.blue("\nApplying patch: ") + chalk.bold.blue(location));
    let command = `git apply ${location}`;
    return executeCommand(command);
};

let stageFile = function (file) {
    console.log(chalk.blue("\nStaging file: ") + chalk.bold.blue(file));
    let command = `git add ${file}`;
    return executeCommand(command);
};

let commitChanges = function (message) {
    console.log(chalk.blue(`\nCommitting changes`));
    let command = `git commit -m "${message}"`;
    return executeCommand(command);
};

let pushChanges = function (branch) {
    console.log(chalk.blue("\nPushing branch: ") + chalk.bold.blue(branch));
    let command = `git push origin ${branch}`;
    return executeCommand(command);
};

let createPullRequest = function (message) {
    console.log(chalk.blue("\nCreating pull request: ") + chalk.bold.blue(message));
    let command = `git pull-request -m "${message}"`;
    executeCommand(command);
};

let processLanguageServer = function (version, createPullRequests) {
    shell.cd(SOURCE_ROOT);
    shell.cd(LANGUAGE_SERVER);

    const RELEASE_BRANCH = `release-${version}`;
    const PATCH_LOCATION = `${PATCH_ROOT}/${LANGUAGE_SERVER}.patch`;

    if (!fetchUpstream()) {
        return;
    }
    if (!checkoutBranch(RELEASE_BRANCH)) {
        return;
    }
    if (!checkPatch(PATCH_LOCATION)) {
        return;
    }
    if (!applyPatch(PATCH_LOCATION)) {
        return;
    }
    if (!stageFile("pom.xml")) {
        return;
    }
    if (!commitChanges(COMMIT_MSG)) {
        return;
    }
    if (!pushChanges(RELEASE_BRANCH)) {
        return;
    }
    if (createPullRequests) {
        createPullRequest("Revert property values");
    }
};

let processDocerina = function (version, createPullRequests) {
    console.log("processDocerina");
};

let processPluginMaven = function (version, createPullRequests) {
    console.log("processPluginMaven");
};

let processComposer = function (version, createPullRequests) {
    console.log("processComposer");
};

let processTesterina = function (version, createPullRequests) {
    console.log("processTesterina");
};

let processContainerSupport = function (version, createPullRequests) {
    console.log("processContainerSupport");
};

let processToolsSwaggerBallerina = function (version, createPullRequests) {
    console.log("processToolsSwaggerBallerina");
};

let processToolsDistribution = function (version, createPullRequests) {
    console.log("processToolsDistribution");
};
