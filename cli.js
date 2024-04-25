#!/usr/bin/env node

const commander = require("commander");
const program = new commander.Command();
const PKG = require("./package.json");

program.version(PKG.version, '-v, --version', 'outout the current version');

program
    .command("set <text>")
    .option("-f, --from-lang <char>", "Input language", "en")
    .option("-t, --to-lang <char>", "Output language", "zh-Hans")
    .action((text, options) => {
        console.log(text, options);
    })

program.parse(process.argv); // 执行这个函数后 通过shell输入的指令参数才会被解析到options中

// 自定义选项处理 原理就跟reduce方法一个意思
const options = program.opts();
console.log(options);



