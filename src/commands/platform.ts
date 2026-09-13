import chalk from "chalk";
import { changeLanguageCode } from "@/commands/language";
import { readConfig, updateConfig } from "@/config";
import { findPlatform, platformName, platformShortName, PLATFORM_KEYS } from "@/platform";
import { PlatformError } from "@/utils/errors";
import { successLog } from "@/utils/log";
import { isLowerCaseEqual } from "@/utils/text";

/** 把用户输入的平台名解析为标准平台名；非法时抛错，交给 CLI 统一打印并置非 0 退出码 */
function requirePlatform(name: string): string {
    const key = findPlatform(name);
    if (!key) {
        throw new PlatformError(`不支持 \`${name}\` 翻译平台，请使用 \`tlm ls\` 命令查看可支持平台`);
    }
    return key;
}

function showPlatformList(): void {
    const { pl } = readConfig();

    PLATFORM_KEYS.forEach((key, index) => {
        const current = isLowerCaseEqual(key, pl);
        const prefix = current ? chalk.blue.bold("* ") : "  ";
        const suffix = current ? chalk.blue(" (目前使用)") : "";
        const message = prefix + platformName(key) + suffix;
        console.log(index === 0 ? "\n" + message : message);
    });
}

function changePlatform(name: string): void {
    const key = requirePlatform(name);

    updateConfig(config => {
        config.pl = key;
    });

    successLog(`正在使用${platformShortName(key)}翻译平台`);

    const { source, target } = readConfig();
    changeLanguageCode({ source, target }, { printSuc: false });
}

function setTranslation(name: string, options: { appid?: string; secretKey: string }): void {
    const key = requirePlatform(name);

    updateConfig(config => {
        const platform = config.platform[key];
        platform.appid = options.appid ?? platform.appid;
        platform.key = options.secretKey ?? platform.key;
    });

    successLog(`${platformShortName(key)}翻译平台成功设置应用ID和秘钥`);
}

function getTranslation(name: string | undefined, options: { show?: boolean }): void {
    const config = readConfig();
    const key = name ? requirePlatform(name) : config.pl;

    const platform = config.platform[key];
    const appid = platform.appid || "暂未设置";
    const secretKey = platform.key ? (options.show ? platform.key : "*".repeat(platform.key.length)) : "暂未设置";

    console.log(`\n${chalk.blue(platformShortName(key) + "翻译")}\n- 应用ID: ${appid}\n- 秘钥: ${secretKey}`);
}

export {
    showPlatformList,
    changePlatform,
    setTranslation,
    getTranslation
};
