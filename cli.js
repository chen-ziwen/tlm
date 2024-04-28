#!/usr/bin/env node

const commander = require("commander");
const pkg = require("./package.json");
const { onList, onUse } = require("./util/actions");

const program = new commander.Command();

program.version(pkg.version, '-v, --version', 'Output the current version');

program
    .command("ls")
    .description("List all the translate language")
    .action(onList);

program
    .command("use <name>")
    .description("Change current translate platform")
    .action(onUse);

program
    .option("-f, --from-lang <char>", "Source language", "en")

program
    .option("-t, --to-lang <char>", "Target language", "zh-Hans")

program.parse(process.argv);




