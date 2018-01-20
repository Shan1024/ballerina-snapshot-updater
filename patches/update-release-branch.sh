###########################################################
# Patches can be generated using one of following commands.
#
# For last commit -
#
#    git format-patch -1 HEAD
#
# For last multiple commits -
#
#    git format-patch -2 --stdout > composer.patch
#
# By - Shan Mahanama
#
###########################################################

DIR_NAME="patches"
COMMIT_MSG="Revert property value"

echo "Enter Ballerina version: "
read BALLERINA_VERSION
echo "Ballerina Version: ${BALLERINA_VERSION}"

RELEASE_BRANCH="release-${BALLERINA_VERSION}"
echo "RELEASE_BRANCH: ${RELEASE_BRANCH}"

cd .. 

# Update language-server ----------------------------------

REPO_NAME="language-server"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..


# Update docerina -----------------------------------------

REPO_NAME="docerina"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..


# Update plugin-maven -------------------------------------

REPO_NAME="plugin-maven"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..


# Update composer -----------------------------------------

REPO_NAME="composer"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nStaging 'modules/web/src/plugins/help/dialogs/about-dialog.jsx'"
git add modules/web/src/plugins/help/dialogs/about-dialog.jsx

echo "\nCommitting staged changes"
git commit -m "Revert symbol" --no-verify

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..


# Update testerina ----------------------------------------

REPO_NAME="testerina"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..


# Update container-support --------------------------------

REPO_NAME="container-support"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nUpdating docs"
mvn clean install

echo "\nStaging 'README.md'"
git add README.md

echo "\nStaging 'ballerina-base-image/README.md'"
git add ballerina-base-image/README.md

echo "\nStaging 'ballerina-base-image/build.sh'"
git add ballerina-base-image/build.sh

echo "\nCommitting staged changes"
git commit -m "Update version in files"

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..


# Update tool-swagger-ballerina ---------------------------

REPO_NAME="tool-swagger-ballerina"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..


# Update tools-distribution -------------------------------

REPO_NAME="tools-distribution"

echo "\n\nReverting property values in ${REPO_NAME}"
cd ${REPO_NAME}

echo "\nFetching Upstream"
git fetch upstream

echo "\nChecking out branch: ${RELEASE_BRANCH}"
git checkout ${RELEASE_BRANCH}

echo "\nApplying patch"
git apply ../${DIR_NAME}/${REPO_NAME}.patch

echo "\nStaging 'pom.xml'"
git add pom.xml

echo "\nCommitting staged changes"
git commit -m "${COMMIT_MSG}"

echo "\nPushing branch ${RELEASE_BRANCH} to origin"
git push origin ${RELEASE_BRANCH}

cd ..

echo "property values reverted successfully."
