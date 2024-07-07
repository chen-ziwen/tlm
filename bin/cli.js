#!/usr/bin/env node

const commander = require("commander");
const pkg = require("../package.json");
const {
    onList,
    onUse,
    onSetTranslation,
    onTranslate,
    onTranslateLanguage
} = require("../util/actions");

const program = new commander.Command();

program.version(pkg.version, '-v, --version', 'Output the current version');
program.name("tl");

program
    .command("ls [langs]")
    .description("List all the translation platform. Type `langs` at the end to see what language can to use.")
    .action(onList);

program
    .command("use <name>")
    .description("Change current translation platform.")
    .action(onUse);

program
    .command("set-translation <name>")
    .option("-a, --appid <appid>", "Set translation platform appid.")
    .requiredOption("-s, --secret-key <secretKey>", "Set translation platform secret key.")
    .description("Set the appid and key for the translation platform to access the channel translation api.")
    .action(onSetTranslation);


// 切换源语言和目标语言，当设置的语言不符合时，选中失败并提示
// 可以手动选择想要设置语言的平台，如果不填参数则默认修改当前选中的语言平台
program
    .command("set-lang [name]")
    .option("-s, --source <source>", "Set source language")
    .option("-t, --target <target>", "Set target language")
    .description("Set source and target languages")
    .action(onTranslateLanguage)

// 后续版本 增加大驼峰、小驼峰、下划线


program
    .command("p")
    .argument("<query...>")
    .description("Translate the text using the \`tl p <query...>\` directive")
    .action(onTranslate)

program.parse(process.argv);
