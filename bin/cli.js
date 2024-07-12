#!/usr/bin/env node
import { Command } from "commander";
import { readFile } from "../util/helpers.js";
import { packagePath } from "../constants.js";
import {
    onList,
    onUse,
    onSetTranslation,
    onTranslate,
    onSetTranslateLanguage
} from "../util/actions.js";

const { version } = await readFile(packagePath);

const program = new Command();

program.version(version, '-v, --version', 'Output the current version');
program.name("tl");

program
    .command("ls [langs]")
    .description("List all the translation platform. Type 'langs' at the end to see what language code can to use.")
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

program
    .command("set-lang")
    .option("-s, --source <source>", "Set source language")
    .option("-t, --target <target>", "Set target language")
    .description("Set source and target languages")
    .action(onSetTranslateLanguage)

program
    .command("p")
    .argument("<query...>")
    .description("Translate the text using the 'tl p <query...>' directive")
    .action(onTranslate)

program.parse(process.argv);
