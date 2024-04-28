
const chalk = require("chalk");
const { configPath } = require("../constants");

const {
    readFile,
    writeFile,
    successLog,
    errorLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    exit,
    isTranslatePlatformNotFound
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
    if (await isTranslatePlatformNotFound(name)) return;
    const config = await readFile(configPath);
    config.pls = name;
    await writeFile(configPath, config);
    successLog(`The translate platform has been changed to '${name}'.`)
}

module.exports = {
    onList,
    onCurrent,
    onUse
}
