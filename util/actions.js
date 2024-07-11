
const chalk = require("chalk");
const { configPath } = require("../constants");
const Translator = require("../bin/platform/translator");
const langs = require("../bin/platform/langs");

const {
    readFile,
    writeFile,
    successLog,
    errorLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    exit,
    isTranslationPlatformNotFound,
    changeLanguageCode
} = require("./helpers");

async function onList(query) {
    if (query == "langs") {
        messageLog("我爱你呀")

    } else {
        const { pl, platform } = await getPlatformInfo();
        const messages = platform.map(([key, value]) => {
            const prefix = isLowerCaseEqual(key, pl) ? chalk.blue.bold("   * ") : "     ";
            const suffix = isLowerCaseEqual(key, pl) ? chalk.blue(" (Currently useing) ") : "";
            return prefix + value.name + suffix;
        });
        messageLog(messages);
    }
}

async function onUse(name) {
    if (await isTranslationPlatformNotFound(name)) return;
    const config = await readFile(configPath);
    config.pl = name;
    await writeFile(configPath, config);
    successLog(`The translation platform has been changed to '${name}'.`)

    const values = await changeLanguageCode({ source: config.source, target: config.target }, { printSuc: false });
    for (let v in values) {
        if (v) config[v] = values[v];
    }
    await writeFile(configPath, config);
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
    const config = await readFile(configPath);
    const values = await changeLanguageCode(languages, {});

    for (let v in values) {
        if (v) config[v] = values[v];
    }
    await writeFile(configPath, config);
}

module.exports = {
    onList,
    onUse,
    onSetTranslation,
    onTranslate,
    onSetTranslateLanguage
}
