
const chalk = require("chalk");
const { configPath } = require("../constants");
const translator = require("../bin/platform/translator");

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

async function onList() {
    const config = await getPlatformInfo();
    const messages = config.platform.map(([key, value]) => {
        const prefix = isLowerCaseEqual(key, config.pls) ? chalk.blue.bold("   * ") : "     ";
        const suffix = isLowerCaseEqual(key, config.pls) ? chalk.blue(" (Currently useing) ") : "";
        return prefix + value.name + suffix;
    });

    messageLog(messages);
}

async function onUse(name) {
    if (await isTranslationPlatformNotFound(name)) return;
    const config = await readFile(configPath);
    config.pls = name;
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
    successLog(`Set api-secre-key ${name} success`);
}

async function onTranslate(query) {
    const txt = await translator.translate(query);
    if (txt) {
        console.log(chalk.blue(txt));
    }
}

module.exports = {
    onList,
    onUse,
    onSetTranslation,
    onTranslate
}
