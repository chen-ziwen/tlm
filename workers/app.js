const commander = require("commander");
const program = new commander.Command();

program
    .option("-i, --input <type>", "Input language", "en")
    .option("-o, --output <type>", "Output language", "zh-Hans")
    .option()

const options = program.opts();

