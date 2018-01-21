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
const PR_MSG = "Merge release branch";

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

console.log(chalk.yellow("Makes snapshot version updating easier in Ballerina repos :)\n"));

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
            shell.echo(chalk.red("Sorry, this tool requires 'git' (https://git-scm.com/downloads)."));
            return;
        }

        if (answers.createPullRequests && !shell.which('hub')) {
            shell.echo(chalk.red("Sorry, this tool requires 'hub' (https://hub.github.com)."));
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
            processLanguageServer(repository, version, createPullRequests);
            break;
        case DOCERINA:
            processDocerina(repository, version, createPullRequests);
            break;
        case PLUGIN_MAVEN:
            processPluginMaven(repository, version, createPullRequests);
            break;
        case COMPOSER:
            processComposer(repository, version, createPullRequests);
            break;
        case TESTERINA:
            processTesterina(repository, version, createPullRequests);
            break;
        case CONTAINER_SUPPORT:
            processContainerSupport(repository, version, createPullRequests);
            break;
        case TOOL_SWAGGER_BALLERINA:
            processToolsSwaggerBallerina(repository, version, createPullRequests);
            break;
        case TOOLS_DISTRIBUTION:
            processToolsDistribution(repository, version, createPullRequests);
            break;
    }
};

let executeCommand = function (command) {
    let response = shell.exec(command);
    if (response.code !== 0) {
        console.log(chalk.bold.red(command) + chalk.red(" failed. Skipping processing current repository."));
        return false;
    }
    return true;
};

let checkSourceDirectory = function (source) {
    let response = shell.cd(source);
    if (response.code !== 0) {
        response = shell.mkdir(source);
        if (response.code !== 0) {
            return false;
        }
        return shell.cd(source).code === 0;
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
    let command = `git apply --check ${location} -v`;
    return executeCommand(command);
};

let applyPatch = function (location) {
    console.log(chalk.blue("\nApplying patch: ") + chalk.bold.blue(location));
    let command = `git apply ${location} -v`;
    return executeCommand(command);
};

let stageFile = function (file) {
    console.log(chalk.blue("\nStaging file: ") + chalk.bold.blue(file));
    let command = `git add ${file}`;
    return executeCommand(command);
};

let commitChanges = function (message, noVerify) {
    console.log(chalk.blue(`\nCommitting changes`));
    let command = `git commit -m "${message}"`;
    if (noVerify) {
        command += " --no-verify";
    }
    return executeCommand(command);
};

let pushChanges = function (branch) {
    console.log(chalk.blue("\nPushing branch: ") + chalk.bold.blue(branch));
    let command = `git push origin ${branch}`;
    return executeCommand(command);
};

let buildRepo = function (skipTests) {
    let command = `mvn clean install`;
    if (skipTests) {
        command += " -Dcheckstyle.skip=true -Dfindbugs.skip=true -DskipTests"
    }
    console.log(chalk.blue("\nBuilding repo: ") + chalk.bold.blue(command));
    return executeCommand(command);
};

// Todo
// let openInBrowser = function (url) {
//     if (shell.which('google-chrome')) {
//         executeCommand("google-chrome " + url);
//         return;
//     }
//     if (shell.which('firefox')) {
//         executeCommand("firefox " + url);
//         return;
//     }
//     console.log(chalk.yellow("\nCould not find a browser to open url: ") + chalk.bold.yellow(url));
// };
//

// Todo
let createPullRequest = function (message) {
    // console.log(chalk.blue("\nCreating pull request: ") + chalk.bold.blue(message));
    // let command = `hub pull-request -m "${message}"`;
    // let response = shell.exec(command, {async: true});
    // if (response.code !== 0) {
    //     console.log(chalk.red("Error occurred while creating the pull request."));
    //     return;
    // }
    // openInBrowser(response.stdout);
    console.log(chalk.yellow("\nCreating pull request is not yet supported."));
};

let processCommonRepo = function (repository, version, createPullRequests) {
    if (!checkSourceDirectory(SOURCE_ROOT)) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(SOURCE_ROOT) + chalk.red(" directory."));
        console.log(chalk.red("Please clone required repos to ") + chalk.bold.red("./sources/")
            + chalk.red(" directory. View README for more details."));
        return;
    }
    if (shell.cd(repository).code !== 0) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(repository) + chalk.red(" directory."));
        console.log(chalk.red("Please clone ") + chalk.bold.red(repository) + chalk.red(" repo."));
        return;
    }

    const RELEASE_BRANCH = `release-${version}`;
    const PATCH_LOCATION = `${PATCH_ROOT}/${repository}.patch`;

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
    if (!commitChanges(COMMIT_MSG, false)) {
        return;
    }
    if (!pushChanges(RELEASE_BRANCH)) {
        return;
    }
    if (createPullRequests) {
        createPullRequest(PR_MSG);
    }
    console.log(chalk.green("\nProcessing ") + chalk.bold.green(repository) + chalk.green(" completed successfully."));
};

let processComposerRepo = function (repository, version, createPullRequests) {
    if (!checkSourceDirectory(SOURCE_ROOT)) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(SOURCE_ROOT) + chalk.red(" directory."));
        console.log(chalk.red("Please clone required repos to ") + chalk.bold.red("./sources/")
            + chalk.red(" directory. View README for more details."));
        return;
    }
    if (shell.cd(repository).code !== 0) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(repository) + chalk.red(" directory."));
        console.log(chalk.red("Please clone ") + chalk.bold.red(repository) + chalk.red(" repo."));
        return;
    }

    const RELEASE_BRANCH = `release-${version}`;
    const PATCH_LOCATION = `${PATCH_ROOT}/${repository}.patch`;

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
    if (!commitChanges(COMMIT_MSG, false)) {
        return;
    }
    if (!stageFile("modules/web/src/plugins/help/dialogs/about-dialog.jsx")) {
        return;
    }
    if (!commitChanges("Revert symbol", true)) {
        return;
    }
    if (!pushChanges(RELEASE_BRANCH)) {
        return;
    }
    if (createPullRequests) {
        createPullRequest(PR_MSG);
    }
    console.log(chalk.green("\nProcessing ") + chalk.bold.green(repository) + chalk.green(" completed successfully."));
};

let buildRequiredRepo = function (repository, version) {
    if (!checkSourceDirectory(SOURCE_ROOT)) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(SOURCE_ROOT) + chalk.red(" directory."));
        console.log(chalk.red("Please clone required repos to ") + chalk.bold.red("./sources/")
            + chalk.red(" directory. View README for more details."));
        return;
    }
    if (shell.cd(repository).code !== 0) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(repository) + chalk.red(" directory."));
        console.log(chalk.red("Please clone ") + chalk.bold.red(repository) + chalk.red(" repo."));
        return;
    }

    const RELEASE_BRANCH = `release-${version}`;

    if (!fetchUpstream()) {
        return;
    }
    if (!checkoutBranch(RELEASE_BRANCH)) {
        return;
    }
    if (!buildRepo(true)) {
        return;
    }
    console.log(chalk.green("\nRepo ") + chalk.bold.green(repository) + chalk.green(" built successfully."));
    return true;
};

let processContainerSupportRepo = function (repository, version, createPullRequests) {
    if (!buildRequiredRepo("ballerina-parent", version)) {
        return;
    }
    if (!buildRequiredRepo("ballerina", version)) {
        return;
    }
    if (!checkSourceDirectory(SOURCE_ROOT)) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(SOURCE_ROOT) + chalk.red(" directory."));
        console.log(chalk.red("Please clone required repos to ") + chalk.bold.red("./sources/")
            + chalk.red(" directory. View README for more details."));
        return;
    }
    if (shell.cd(repository).code !== 0) {
        console.log(chalk.red("Failed to navigate to ") + chalk.bold.red(repository) + chalk.red(" directory."));
        console.log(chalk.red("Please clone ") + chalk.bold.red(repository) + chalk.red(" repo."));
        return;
    }

    const RELEASE_BRANCH = `release-${version}`;
    const PATCH_LOCATION = `${PATCH_ROOT}/${repository}.patch`;

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
    if (!commitChanges(COMMIT_MSG, false)) {
        return;
    }
    if (!buildRepo(false)) {
        return;
    }
    if (!stageFile("README.md")) {
        return;
    }
    if (!stageFile("ballerina-base-image/README.md")) {
        return;
    }
    if (!stageFile("ballerina-base-image/build.sh")) {
        return;
    }
    if (!commitChanges("Update version in files", false)) {
        return;
    }
    if (!pushChanges(RELEASE_BRANCH)) {
        return;
    }
    if (createPullRequests) {
        createPullRequest(PR_MSG);
    }
    console.log(chalk.green("\nProcessing ") + chalk.bold.green(repository) + chalk.green(" completed successfully."));
};

let processLanguageServer = function (repository, version, createPullRequests) {
    processCommonRepo(repository, version, createPullRequests);
};

let processDocerina = function (repository, version, createPullRequests) {
    processCommonRepo(repository, version, createPullRequests);
};

let processPluginMaven = function (repository, version, createPullRequests) {
    processCommonRepo(repository, version, createPullRequests);
};

let processComposer = function (repository, version, createPullRequests) {
    processComposerRepo(repository, version, createPullRequests);
};

let processTesterina = function (repository, version, createPullRequests) {
    processCommonRepo(repository, version, createPullRequests);
};

let processContainerSupport = function (repository, version, createPullRequests) {
    processContainerSupportRepo(repository, version, createPullRequests);
};

let processToolsSwaggerBallerina = function (repository, version, createPullRequests) {
    processCommonRepo(repository, version, createPullRequests);
};

let processToolsDistribution = function (repository, version, createPullRequests) {
    processCommonRepo(repository, version, createPullRequests);
};
