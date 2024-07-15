import fs from "fs";
import chalk from "chalk";
import process from "../process.js";
import { configPath, defaultLanguage, supportLanguage } from "../constants.js";
import * as languages from "../bin/platform/langs.js";

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

async function getPlatformConfig(name) {
    const config = await readFile(configPath);
    const platform = config.platform[name];
    const source = config.source, target = config.target, pl = config.pl;
    return { ...platform, source, target, pl }
}

async function isTranslationPlatformNotFound(name, print = true) {
    const config = await getPlatformInfo();
    const keys = config.platform.map(item => item[0]);
    if (!keys.includes(name)) {
        print && errorLog(`The translation platform '${name}' is not found.`);
        return true;
    }
    return false;
}

async function showLanguageList() {
    const config = await readFile(configPath);
    const { source, pl } = config;
    const { sourceMap, targetMap } = languages[pl];
    const condition = { "include": false, "exclude": true };
    const langsList = { sourceList: [], targetList: [] };
    const langsMap = { "source": sourceMap, "target": targetMap[source] };

    for (let value of supportLanguage) {
        const code = value.code;
        const name = value.zh + "-" + code;
        for (let key in langsMap) {
            const { strategy, language } = langsMap[key];
            if (language.includes(code) == condition[strategy]) {
                langsList[key + "List"].push({ name, code, selectable: false });
            } else {
                langsList[key + "List"].push({ name, code, selectable: true });
            }
        }
    }
    
    langsList.targetList = langsList.targetList.filter(item => item.code !== "auto");
    return langsList;
}

function matchPlatformLanguageCode(name, { source, target }) {
    const { codeMap } = languages[name];
    return { "source": codeMap[source], "target": codeMap[target] };
}

async function changeLanguageCode(langs, { printSuc = true, printErr = true }) {
    const orderLangs = { "source": langs.source, "target": langs.target };
    const config = await readFile(configPath);
    const { source, target, pl } = config;
    const map = { source, target };
    const { codeMap, sourceMap, targetMap } = languages[pl];
    const condition = { "include": false, "exclude": true };

    for (let key in orderLangs) {
        const value = orderLangs[key];
        if (!value) continue;
        if (Object.keys(codeMap).includes(value)) {
            const langsMap = { "source": sourceMap, "target": targetMap[map["source"]] };
            const { strategy, language } = langsMap[key];
            if (language.includes(value) == condition[strategy]) {
                map[key] = defaultLanguage[key];
                printErr && errorLog(`The ${key} language does not support '${value}' language code has been replaced with the default code '${map[key]}'.`);
            } else {
                map[key] = value;
                printSuc && successLog(`The ${key} language code successfully switched to '${value}'.`);
            }
        } else {
            printErr && errorLog(`The '${value}' language code is not supported in the ${key} language.`);
        }
    }

    for (let v in map) {
        if (v) config[v] = map[v];
    }

    await writeFile(configPath, config);
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

export {
    successLog,
    errorLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    getPlatformConfig,
    isTranslationPlatformNotFound,
    changeLanguageCode,
    matchPlatformLanguageCode,
    showLanguageList,
    readFile,
    writeFile
}