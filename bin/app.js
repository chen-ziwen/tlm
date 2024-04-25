const commander = require("commander");
const program = new commander.Command();

function createCommander() {
    program
        .option("-v, --version <char>", "show version")
        .option("-i, --input <char>", "Input language", "en")
        .option("-o, --output <char>", "Output language", "zh-Hans");

    program.parse();

    const options = program.opts();

    console.log(options);
}

module.exports = {
    createCommander,
}


