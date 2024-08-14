import fs from "fs";
import chalk from "chalk";
import stringWidth from "string-width";
import { LANGUAGE_MAP, TLMRC } from "@/constants";
import * as languages from "@bin/langs";

async function readFile(file: string) {
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

async function writeFile(path: string, content: Tl.Config): Promise<void> {
    return new Promise(resolve => {
        try {
            fs.writeFileSync(path, JSON.stringify(content, null, 2));
            resolve();
        } catch (error) {
            exit(error);
        }
    })
}

async function isExistConfig(path: string): Promise<boolean> {
    return new Promise(resolve => {
        fs.access(path, (err) => err ? resolve(false) : resolve(true));
    })
}

async function getPlatformInfo() {
    const config = <Tl.Config>await readFile(TLMRC);
    const platform = Object.entries(config.platform);
    return { pl: config.pl, platform }
}

async function getPlatformConfig(name: string) {
    const config = <Tl.Config>await readFile(TLMRC);
    const platform = config.platform[name];
    const source = config.source, target = config.target, pl = config.pl;
    return { ...platform, source, target, pl }
}

async function getPlatformName(name: string) {
    const { platform } = await getPlatformInfo();
    for (let [key, value] of platform) {
        if (key == name) {
            return value.name.split("-")[0];
        }
    }
    return name;
}

function stringFill(len: number, text: string) {
    return text.padEnd(len - stringWidth(text) + text.length);
}

function foundZhMap(code: string) {
    return LANGUAGE_MAP.find(item => item.code == code)?.zh ?? code;
}

function matchPlatformLanguageCode(name: string, { source, target }: { source: string, target: string }) {
    const { codeMap } = (<{ [key: string]: Tl.LangsConfig }>languages)[name];
    return { "source": codeMap[source], "target": codeMap[target] };
}

function successLog(message: string) {
    console.log(chalk.bgGreenBright(" 成功 ") + " " + message);
}

function errorLog(error: unknown) {
    console.error(chalk.bgRed(" 失败 ") + " " + chalk.red(error));
}

function isLowerCaseEqual(s1: string, s2: string) {
    if (s1 && s2) {
        return s1.toLowerCase() === s2.toLowerCase();
    } else {
        return !s1 && !s2;
    }
}

function exit(error: unknown) {
    error && errorLog(error);
    process.exit(1);
}

export {
    successLog,
    errorLog,
    isLowerCaseEqual,
    getPlatformInfo,
    getPlatformName,
    getPlatformConfig,
    matchPlatformLanguageCode,
    stringFill,
    foundZhMap,
    readFile,
    writeFile,
    isExistConfig
}