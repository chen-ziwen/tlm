const commander = require("commander");
const program = new commander.Command();

function createCommander() {
    console.log("trigger ===>");
    program
        .option("-i, --input <char>", "Input language", "en")
        .option("-o, --output <char>", "Output language", "zh-Hans");
    // .option()

    program.parse();

    const options = program.opts();

    console.log(options);
}

module.exports = {
    createCommander,
}


