#!/usr/bin/env node

const commander = require("commander");
const pkg = require("../package.json");
const {
    onList,
    onUse,
    onSetTranslation,
    onTranslate
} = require("../util/actions");

const program = new commander.Command();

program.version(pkg.version, '-v, --version', 'Output the current version');

program
    .command("ls")
    .description("List all the translation platform")
    .action(onList);

program
    .command("use <name>")
    .description("Change current translation platform")
    .action(onUse);

program
    .command("set-translation <name>")
    .option("-a, --appid <appid>", "Set translation platform appid")
    .requiredOption("-s, --secret-key <secretKey>", "Set translation platform secret key")
    .description("Set the appid and key for the translation platform to access the channel translation api")
    .action(onSetTranslation);

// // 查看源语言和目标语言，并选中当前的源语言和目标语言
// program
//     .command()

// // 切换源语言和目标语言，当设置的语言不符合时，选中失败并提示
// program
//     .command()
//     .option()

program
    .command("p")
    .argument("<query...>")
    .description("Translate the text using the \`tl p <params...>\` directive")
    .action(onTranslate)

program.parse(process.argv);
