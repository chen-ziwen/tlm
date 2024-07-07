
const chalk = require("chalk");
const { configPath } = require("../constants");
const Translator = require("../bin/platform/translator");

const {
    readFile,
    writeFile,
    successLog,
    errorLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    exit,
    isTranslationPlatformNotFound
} = require("./helpers");

async function onList(query) {
    if (query == "langs") {
        messageLog("我爱你呀")

    } else {
        const config = await getPlatformInfo();
        const messages = config.platform.map(([key, value]) => {
            const prefix = isLowerCaseEqual(key, config.pl) ? chalk.blue.bold("   * ") : "     ";
            const suffix = isLowerCaseEqual(key, config.pl) ? chalk.blue(" (Currently useing) ") : "";
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
}

async function onSetTranslation(name, { appid, secretKey }) {
    if (await isTranslationPlatformNotFound(name)) return;
    const config = await readFile(configPath);
    const platform = config.platform[name];
    platform.appid = appid;
    platform.key = secretKey;
    await writeFile(configPath, config);
    successLog(`Set api-secret-key ${name} success`);
}

async function onTranslate(query) {
    const txt = await Translator.translate(query);
    if (txt) console.log(chalk.blue(txt));
}

async function onTranslateLanguage(name, { source, target }) {
    if (name) {
        if (await isTranslationPlatformNotFound(name)) return;
    } else {
        console.log(`设置源语言和目标语言。源语言:${source} 目标语言:${source}`);
    }
}

module.exports = {
    onList,
    onUse,
    onSetTranslation,
    onTranslate,
    onTranslateLanguage
}
