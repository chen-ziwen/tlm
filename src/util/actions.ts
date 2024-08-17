import chalk from "chalk";
import Translator from "@bin/translator";
import {
    showLanguageList,
    showPlatformList,
    changePlatform,
    changeLanguageCode,
    setTranslation,
    getTranslation
} from "@/util/controller";

async function onList(query: string) {
    if (query == "langs") {
        await showLanguageList();
    } else {
        await showPlatformList();
    }
}

async function onUse(name: string) {
    await changePlatform(name);
}

async function onSetTranslation(name: string, info: { appid: string, secretKey: string }) {
    await setTranslation(name, info);
}

async function onGetTranslation(name: string, info: { show: boolean }) {
    await getTranslation(name, info);
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
    onGetTranslation,
    onTranslate,
    onSetTranslateLanguage
}
