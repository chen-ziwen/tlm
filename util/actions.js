import chalk from "chalk";
import { configPath } from "../constants.js";
import Translator from "../bin/platform/translator.js";

import {
    readFile,
    writeFile,
    successLog,
    errorLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    isTranslationPlatformNotFound,
    showLanguageList,
    changeLanguageCode
} from "./helpers.js";

async function onList(query) {
    if (query == "langs") {
        await showLanguageList();
    } else {
        const { pl, platform } = await getPlatformInfo();
        const messages = platform.map(([key, value]) => {
            const prefix = isLowerCaseEqual(key, pl) ? chalk.blue.bold("* ") : "  ";
            const suffix = isLowerCaseEqual(key, pl) ? chalk.blue(" (Currently useing) ") : "";
            return prefix + value.name + suffix;
        });
        messageLog(messages);
    }
}

async function onUse(name) {
    if (await isTranslationPlatformNotFound(name)) return;
    const config = await readFile(configPath);
    const { source, target } = config;
    config.pl = name;
    await writeFile(configPath, config);
    successLog(`The translation platform has been changed to '${name}'.`)
    await changeLanguageCode({ source, target }, { printSuc: false });
}

async function onSetTranslation(name, { appid, secretKey }) {
    if (await isTranslationPlatformNotFound(name)) return;
    const config = await readFile(configPath);
    const platform = config.platform[name];
    platform.appid = appid ?? platform.appid;
    platform.key = secretKey ?? platform.key;
    await writeFile(configPath, config);
    successLog(`Set api-secret-key ${name} success`);
}

async function onTranslate(query) {
    const txt = await Translator.translate(query);
    if (txt) console.log(chalk.blue(txt));
}

async function onSetTranslateLanguage(languages) {
    await changeLanguageCode(languages, {});
}

export {
    onList,
    onUse,
    onSetTranslation,
    onTranslate,
    onSetTranslateLanguage
}
