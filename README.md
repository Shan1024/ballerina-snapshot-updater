# Ballerina Snapshot Updater

Makes snapshot version updating in Ballerina repos easier by updating release branches and sending pull requests.

![alt text](images/ballerina-repo-updater.gif)

## Prerequisites

You need following applications to run the BSU.

1. [git](https://git-scm.com/downloads)
2. [hub](https://hub.github.com)
3. [node + npm](https://nodejs.org/en/download/)

Also make sure to clone required repos (mentioned below) to `sources/` directory in the repo. Make sure to add origin and upstream correctly. Recommended way is to add a symlink named `sources` to the directory containing already cloned repos using following command.

```bash
ln -s PATH_TO_GIT_SOURCES_ROOT_DIR sources
```

Eg: 

If you have repos mentioned below including this repo in the same directory -

```bash
ln -s ../ sources
```

#### Required Repos

1. [language-server](https://github.com/ballerinalang/language-server)
2. [docerina](https://github.com/ballerinalang/docerina)
3. [plugin-maven](https://github.com/ballerinalang/plugin-maven)
4. [composer](https://github.com/ballerinalang/composer)
5. [testerina](https://github.com/ballerinalang/testerina)
6. [container-support](https://github.com/ballerinalang/container-support)
7. [tools-swagger-ballerina](https://github.com/ballerinalang/tool-swagger-ballerina)
8. [tools-distribution](https://github.com/ballerinalang/tools-distribution)

## How To Use

Run the following command. 

```bash
npm run updater
```
