import chalk from "chalk";

function successLog(message: string): void {
    console.log(chalk.bgGreenBright(" 成功 ") + " " + message);
}

function errorLog(error: unknown): void {
    console.error(chalk.bgRed(" 失败 ") + " " + chalk.red(error));
}

function exitWithError(error: unknown): never {
    error && errorLog(error instanceof Error ? error.message : error);
    process.exit(1);
}

export {
    successLog,
    errorLog,
    exitWithError
};
