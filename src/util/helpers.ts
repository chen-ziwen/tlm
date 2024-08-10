import fs from "fs";
import chalk from "chalk";
import stringWidth from "string-width";
import { configPath, defaultLanguage, supportLanguage, languageZh } from "@/constants";
import * as languages from "@bin/langs";

interface LangsList {
    name: string;
    code: string;
    selectable: boolean;
}

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

async function getPlatformInfo() {
    const config = <Tl.Config>await readFile(configPath);
    const platform = Object.entries(config.platform);
    return { pl: config.pl, platform }
}

async function getPlatformConfig(name: string) {
    const config = <Tl.Config>await readFile(configPath);
    const platform = config.platform[name];
    const source = config.source, target = config.target, pl = config.pl;
    return { ...platform, source, target, pl }
}

async function isTranslationPlatformNotFound(name: string, print = true) {
    const config = await getPlatformInfo();
    const keys = config.platform.map(item => item[0]);
    if (!keys.includes(name)) {
        print && errorLog(`暂不支持 '${name}' 翻译平台，请检查是否输入错误！`);
        return true;
    }
    return false;
}

async function languageListHanle() {
    const config = <Tl.Config>await readFile(configPath);
    const { source, pl } = config;
    const { sourceMap, targetMap } = (<{ [key: string]: Tl.LangsConfig }>languages)[pl];
    const condition: { [key: string]: boolean } = { "include": false, "exclude": true };
    const langsList: { [key: string]: LangsList[] } = { sourceList: [], targetList: [] };
    const langsMap: { [key: string]: Tl.LangMsg } = { "source": sourceMap, "target": targetMap[source] };

    for (let value of supportLanguage) {
        const code = value.code;
        const name = value.zh + "-" + code;
        for (let key in langsMap) {
            const { strategy, language } = langsMap[key];
            if (language.includes(code) == condition[strategy]) {
                langsList[key + "List"].push({ name, code, selectable: false });
            } else {
                langsList[key + "List"].push({ name, code, selectable: true });
            }
        }
    }

    return langsList;
}


function stringFill(len: number, text: string) {
    return text.padEnd(len - stringWidth(text) + text.length);
}

function foundZhMap(code: string) {
    return supportLanguage.find(item => item.code == code)?.zh ?? code;
}

async function showLanguageList(len = 14) {
    const langsList = await languageListHanle();
    const { source, target } = <Tl.Config>await readFile(configPath);
    const map: { [key: string]: string } = { "sourceList": source, "targetList": target };

    console.log(`\n- ${chalk.blue('蓝色')}高亮文本为当前选中语种\n- ${chalk.red('红色')}高亮语种为当前不支持语种\n- 不同翻译平台的不同语种支持略有差异\n`);
    // 打印表头
    console.log(`| ${stringFill(len, '源语言')} | ${stringFill(len, "目标语言")} |`);
    // 打印分隔线
    console.log(`|${'-'.repeat(len + 2)}|${'-'.repeat(len + 2)}|`);
    // 打印数据行
    supportLanguage.forEach(item => {
        let rowStr = "";
        Object.entries(langsList).forEach(([key, list]) => {
            let row = list.find(row => row.code == item.code);
            if (row) {
                let name = row.name;
                if (!row.selectable) name = chalk.red(name);
                if (item.code == map[key]) name = chalk.blue(name);
                if (key == "sourceList") {
                    rowStr += `| ${stringFill(len, name)} |`;
                } else {
                    rowStr += ` ${stringFill(len, name)} |`;
                }
            }
        });
        console.log(rowStr);
    })
}

function matchPlatformLanguageCode(name: string, { source, target }: { source: string, target: string }) {
    const { codeMap } = (<{ [key: string]: Tl.LangsConfig }>languages)[name];
    return { "source": codeMap[source], "target": codeMap[target] };
}

async function changeLanguageCode(langs: Tl.DefaultLangs, { printSuc = true, printErr = true }) {
    const config = <Tl.Config>await readFile(configPath);
    const { source, target, pl } = config;
    const map = Object.assign({ source, target }, langs);
    const { codeMap, sourceMap, targetMap } = (<{ [key: string]: Tl.LangsConfig }>languages)[pl];
    const condition = { "include": false, "exclude": true };

    let key: keyof typeof map;
    for (key in map) {
        const value = map[key];
        if (Object.keys(codeMap).includes(value)) {
            const langsMap: { [key: string]: Tl.LangMsg } = { "source": sourceMap, "target": targetMap[map["source"]] };
            const { strategy, language } = langsMap[key];
            if (language.includes(value) == condition[strategy]) {
                map[key] = defaultLanguage[key];
                printErr && errorLog(`当前选择下，${languageZh[key]}不支持 \`${foundZhMap(value)}\`，自动替换为默认语种 \`${foundZhMap(map[key])}\``);
            } else {
                map[key] = value;
                printSuc && langs[key] && successLog(`${languageZh[key]}已成功切换为 \`${foundZhMap(value)}\``);
            }
        } else {
            map[key] = config[key];
            printErr && errorLog(`${languageZh[key]}无法识别 \`${value}\` 语种，请检查是否输入错误！`);
        }
    }

    for (key in map) {
        if (key) config[key] = map[key];
    }

    await writeFile(configPath, config);
}


function successLog(message: string) {
    console.log(chalk.bgGreenBright(" 成功 ") + " " + message);
}

function errorLog(error: unknown) {
    console.error(chalk.bgRed(" 失败 ") + " " + chalk.red(error));
}

function messageLog(messages: string[]) {
    for (const message of messages) {
        console.log(message);
    }
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
    messageLog,
    isLowerCaseEqual,
    getPlatformInfo,
    getPlatformConfig,
    isTranslationPlatformNotFound,
    changeLanguageCode,
    matchPlatformLanguageCode,
    showLanguageList,
    readFile,
    writeFile
}