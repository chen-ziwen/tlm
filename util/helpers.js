const fs = require("fs");
const chalk = require("chalk");
const process = require('../process');
const { configPath, defaultLanguage, supportLanguage } = require('../constants');
const languages = require("../bin/platform/langs");

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
            fs.writeFileSync(path, JSON.stringify(content, null, 2));
            resolve();
        } catch (error) {
            exit(error);
        }
    })
}

async function getPlatformInfo() {
    const config = await readFile(configPath);
    const platform = Object.entries(config.platform);
    return { pl: config.pl, platform }
}

async function getPlatformList() {
    const config = await readFile(configPath);
    return Object.keys(config.platform);
}

async function getPlatformConfig(name) {
    const config = await readFile(configPath);
    const platform = config.platform[name];
    const to = config.to, from = config.from, pl = config.pl;
    return { ...platform, to, from, pl }
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

function matchPlatformLanguageCode(name, { from, to }) {
    const { codeMapping } = languages[name];
    return { "from": codeMapping[from], "to": codeMapping[to] };
}

async function isLanguageNotFound(lang, printErr = true) {
    const { from, to, pl } = await readFile(configPath);
    const { codeMapping } = languages[pl];
    const map = { "source": from, "target": to };
    const mergeMap = Object.assign({}, map, lang);
    const keys = Object.keys(codeMapping);

    for (let key in mergeMap) {
        const value = mergeMap[key];
        if (keys.includes(value)) {
            map[key] = value;
        } else {
            printErr && errorLog(`'${value}' is not a supported ${key} language.`);
        }
    }
    // 还需要做一些别的判断
    console.log(map);
    return map;
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

function exit(error) {
    error && errorLog(error);
    process.exit(1);
}

module.exports = {
    successLog,
    errorLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    getPlatformList,
    getPlatformConfig,
    isTranslationPlatformNotFound,
    isLanguageNotFound,
    matchPlatformLanguageCode,
    readFile,
    writeFile
}