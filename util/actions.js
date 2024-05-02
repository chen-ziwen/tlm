
const chalk = require("chalk");
const { configPath } = require("../constants");
const { translate } = require("../bin/platform/index");

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

async function onCurrent(name) {

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

    // 先实现一个能用的 就先用火山的来测试吧
    const config = await readFile(configPath);
    const platform = config.platform[name];
    platform.appid = appid;
    platform.key = secretKey;
    await writeFile(configPath, config);
    successLog(`Set api-secre-key ${name} success`);
    console.log('set-Translation ===>', name, appid, secretKey);
}

async function onTranslate(query) {
    const txt = await translate(query);
    console.log(chalk.blue(txt));
}

module.exports = {
    onList,
    onCurrent,
    onUse,
    onSetTranslation,

    onTranslate
}
