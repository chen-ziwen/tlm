#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { changeLanguageCode, showLanguageList } from "@/commands/language";
import { changePlatform, getTranslation, setTranslation, showPlatformList } from "@/commands/platform";
import { PACKAGE_PATH } from "@/constants";
import { translate } from "@/translator";
import type { DefaultLangs } from "@/types";
import { readJson } from "@/utils/io";
import { exitWithError } from "@/utils/log";

const { version } = readJson<{ version: string }>(PACKAGE_PATH) ?? { version: "0.0.0" };

const program = new Command();

program.name("tlm").usage("command [options]");
program.version(version, "-v, --version", "输出当前版本");

program
    .command("ls [langs]")
    .description("列出所有翻译平台，在末尾输入 'langs' 以查看可以使用的语言代码")
    .action((langs?: string) => langs === "langs" ? showLanguageList() : showPlatformList());

program
    .command("use <name>")
    .description("更改当前的翻译平台")
    .action((name: string) => changePlatform(name));

program
    .command("set-trl <name>")
    .option("-a, --appid <appid>", "设置翻译平台应用ID")
    .requiredOption("-s, --secret-key <secretKey>", "设置翻译平台密钥")
    .description("设置翻译平台访问渠道的应用ID和密钥")
    .action((name: string, options: { appid?: string; secretKey: string }) => setTranslation(name, options));

program
    .command("get-trl [name]")
    .option("-s, --show", "显示真正的秘钥")
    .description("显示指定平台的应用ID和密钥，不指定则显示当前选中平台")
    .action((name: string | undefined, options: { show?: boolean }) => getTranslation(name, options));

program
    .command("set-langs")
    .option("-s, --source <source>", "设置源语言")
    .option("-t, --target <target>", "设置目标语言")
    .description("设置源语言和目标语言")
    .action((options: Partial<DefaultLangs>) => changeLanguageCode(options));

program
    .command("p")
    .argument("<query...>")
    .description("使用 'tlm p <query...>' 指令翻译文本")
    .action(async (query: string[]) => {
        console.log(chalk.blue(await translate(query)));
    });

program.parseAsync(process.argv).catch(exitWithError);
