import chalk from "chalk";
import { configPath } from "@/constants";
import Translator from "@bin/translator";

import {
    readFile,
    writeFile,
    successLog,
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    getPlatformName,
    isTranslationPlatformNotFound,
    showLanguageList,
    changeLanguageCode
} from "@util/helpers";

async function onList(query: string) {
    if (query == "langs") {
        await showLanguageList();
    } else {
        const { pl, platform } = await getPlatformInfo();
        const messages = platform.map(([key, value]) => {
            const prefix = isLowerCaseEqual(key, pl) ? chalk.blue.bold("* ") : "  ";
            const suffix = isLowerCaseEqual(key, pl) ? chalk.blue(" (当前选中) ") : "";
            return prefix + value.name + suffix;
        });
        messageLog(messages);
    }
}

async function onUse(name: string) {
    if (await isTranslationPlatformNotFound(name)) return;
    const config = <Tl.Config>await readFile(configPath);
    const { source, target } = config;
    config.pl = name;
    await writeFile(configPath, config);
    const plName = await getPlatformName(name);
    successLog(`正在使用${plName}翻译平台`);
    await changeLanguageCode({ source, target }, { printSuc: false });
}

async function onSetTranslation(name: string, { appid, secretKey }: { appid: string, secretKey: string }) {
    if (await isTranslationPlatformNotFound(name)) return;
    const config = <Tl.Config>await readFile(configPath);
    const platform = config.platform[name];
    platform.appid = appid ?? platform.appid;
    platform.key = secretKey ?? platform.key;
    await writeFile(configPath, config);
    const plName = await getPlatformName(name);
    successLog(`${plName}翻译平台成功设置应用ID和秘钥`);
}

async function onTranslate(query: string[]) {
    const txt = await Translator.translate(query);
    if (txt) console.log(chalk.blue(txt));
}

async function onSetTranslateLanguage(languages: Tl.DefaultLangs) {
    await changeLanguageCode(languages, {});
}

export {
    onList,
    onUse,
    onSetTranslation,
    onTranslate,
    onSetTranslateLanguage
}
