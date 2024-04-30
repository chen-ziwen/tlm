const fs = require("fs");
const chalk = require("chalk");
const process = require('../process');
const { configPath } = require('../constants');

async function readFile(file) {
    return new Promise(resolve => {
        if (!fs.existsSync(file)) {
            resolve({});
        } else {
            try {
                const content = fs.readFileSync(file, 'utf-8');
                resolve(JSON.parse(content));
            } catch (error) {
                exit(error);
            }
        }
    })
}

async function writeFile(path, content) {
    return new Promise(resolve => {
        try {
            fs.writeFileSync(path, JSON.stringify(content));
            resolve();
        } catch (error) {
            exit(error);
        }
    })
}

async function getPlatformInfo() {
    const config = await readFile(configPath);
    const platform = Object.entries(config.platform);
    return {
        pls: config.pls,
        platform
    }
}

async function getPlatformList() {
    const config = await readFile(configPath);
    return Object.keys(config.platform);
}

async function getPlatformItem(name) {
    if (isTranslationPlatformNotFound(name)) return;
    const config = await readFile(configPath);
    return { ens: name, to: config.to, from: config.from, ...config.platform[name] };
}

async function isTranslationPlatformNotFound(name, printErr = true) {
    const config = await getPlatformInfo();
    const keys = config.platform.map(item => item[0]);
    if (!keys.includes(name)) {
        printErr && errorLog(`The translation platform '${name}' is not found.`);
        return true;
    }
    return false;
}

function successLog(message) {
    console.log(chalk.bgGreenBright(" SUCCESS ") + " " + message);
}

function errorLog(error) {
    console.error(chalk.bgRed(" ERROR ") + " " + chalk.red(error));
}

function messageLog(messages) {
    for (const message of messages) {
        console.log(message);
    }
}

function isLowerCaseEqual(s1, s2) {
    if (s1 && s2) {
        return s1.toLowerCase() === s2.toLowerCase();
    } else {
        return !s1 && !s2;
    }
}

function verifTranslationInfo(appid, secretKey) {
    //    if()
}

function exit(error) {
    error && errorLog(error);
    process.exit(1);
}

module.exports = {
    exit,
    successLog,
    errorLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    getPlatformList,
    getPlatformItem,
    isTranslationPlatformNotFound,
    readFile,
    writeFile
}