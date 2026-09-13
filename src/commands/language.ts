import chalk from "chalk";
import { DEFAULT_LANGUAGE, LANGUAGE_MAP, LANGUAGE_ZH } from "@/constants";
import { readConfig, updateConfig } from "@/config";
import { isLanguageSupported, platformLangs } from "@/platform";
import type { DefaultLangs, LangRule } from "@/types";
import { PlatformError } from "@/utils/errors";
import { errorLog, successLog } from "@/utils/log";
import { foundZhMap, stringFill } from "@/utils/text";

interface LangsList {
    name: string;
    code: string;
    supported: boolean;
}

const EMPTY_RULE: LangRule = { strategy: "exclude", language: [] };

/** 当前平台下，源语言与目标语言各自的可选情况 */
function languageListHandle(): { source: LangsList[]; target: LangsList[] } {
    const { source, pl } = readConfig();
    const { sourceMap, targetMap } = platformLangs(pl);
    const rules = { source: sourceMap, target: targetMap[source] ?? EMPTY_RULE };
    const list = { source: [] as LangsList[], target: [] as LangsList[] };

    for (const item of LANGUAGE_MAP) {
        for (const key of ["source", "target"] as const) {
            list[key].push({
                name: `${item.zh}-${item.code}`,
                code: item.code,
                supported: isLanguageSupported(rules[key], item.code)
            });
        }
    }

    return list;
}

function showLanguageList(len = 14): void {
    const list = languageListHandle();
    const { source, target } = readConfig();
    const current: Record<string, string> = { source, target };

    console.log(`\n- ${chalk.blue('蓝色')}高亮文本为当前选中语种\n- ${chalk.red('红色')}高亮文本为当前不支持语种\n- 不同翻译平台的不同语种支持略有差异\n`);
    console.log(`| ${stringFill(len, '源语言')} | ${stringFill(len, "目标语言")} |`);
    console.log(`|${'-'.repeat(len + 2)}|${'-'.repeat(len + 2)}|`);

    for (const item of LANGUAGE_MAP) {
        const cells = (["source", "target"] as const).map(key => {
            const row = list[key].find(row => row.code === item.code);
            if (!row) return stringFill(len, "");

            let name = row.supported ? row.name : chalk.red(row.name);
            if (item.code === current[key]) name = chalk.blue(name);
            return stringFill(len, name);
        });

        console.log(`| ${cells[0]} | ${cells[1]} |`);
    }
}

/**
 * 切换源语言/目标语言。
 * 只处理调用方显式传入的字段，未传的字段保持原值；
 * 语种代码写错视为失败（抛错 + 非 0 退出码），
 * 语种合法但当前平台不支持时自动替换为默认语种（仅提示，不算失败）。
 */
function changeLanguageCode(
    update: Partial<DefaultLangs>,
    { printSuc = true, printErr = true }: { printSuc?: boolean; printErr?: boolean } = {}
): void {
    const current = readConfig();
    const { codeMap, sourceMap, targetMap } = platformLangs(current.pl);
    const next: DefaultLangs = { source: current.source, target: current.target };
    let handled = false;

    for (const key of ["source", "target"] as const) {
        const value = update[key];
        if (value === undefined) continue;
        handled = true;

        if (!(value in codeMap)) {
            if (!printErr) continue;
            throw new PlatformError(`${LANGUAGE_ZH[key]}无法识别 \`${value}\` 语种，请检查是否输入错误！`);
        }

        const rule = key === "source" ? sourceMap : targetMap[next.source] ?? EMPTY_RULE;
        if (isLanguageSupported(rule, value)) {
            next[key] = value;
            if (printSuc) successLog(`${LANGUAGE_ZH[key]}已成功切换为 \`${foundZhMap(value)}\``);
        } else {
            next[key] = DEFAULT_LANGUAGE[key];
            if (printErr) errorLog(`当前选择下，${LANGUAGE_ZH[key]}不支持 \`${foundZhMap(value)}\`，自动替换为默认语种 \`${foundZhMap(next[key])}\``);
        }
    }

    if (!handled) {
        throw new PlatformError("请至少指定一个参数：`-s, --source <source>` 或 `-t, --target <target>`");
    }

    if (next.source === current.source && next.target === current.target) return;

    updateConfig(config => {
        config.source = next.source;
        config.target = next.target;
    });
}

export {
    languageListHandle,
    showLanguageList,
    changeLanguageCode
};
