#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "@util/helpers";
import { packagePath } from "@/constants";
import {
    onList,
    onUse,
    onSetTranslation,
    onTranslate,
    onSetTranslateLanguage
} from "@util/actions";

const { version } = <{ version: string }>await readFile(packagePath);

const program = new Command();

program.version(version, '-v, --version', '输出当前版本');

program.name("tl").usage("command [options]");

program.helpOption('-h, --help', '显示命令帮助');

program.helpCommand('help', '显示命令帮助');

program
    .command("ls [langs]")
    .description("展示翻译平台列表，末尾加上 'langs' 可查看当前选中的语种")
    .action(onList);

program
    .command("use <name>")
    .description("切换当前的翻译平台")
    .action(onUse);

program
    .command("set-translation <name>")
    .option("-a, --appid <appid>", "设置翻译平台的应用ID")
    .requiredOption("-s, --secret-key <secretKey>", "设置翻译平台的秘钥")
    .description("设置翻译平台的应用ID和秘钥去连接访问翻译API")
    .action(onSetTranslation);

program
    .command("set-langs")
    .option("-s, --source <source>", "设置源语言")
    .option("-t, --target <target>", "设置目标语言")
    .description("设置源语言和目标语言")
    .action(onSetTranslateLanguage)

program
    .command("p")
    .argument("<query...>")
    .description("翻译文本使用 'tl p <query...>' 命令")
    .action(onTranslate)

program.parse(process.argv);
