#!/usr/bin/env node

const commander = require("commander");
const program = new commander.Command();

program.version("0.0.1", '-v, --version', 'outout the current version');

program
    .option("-i, --input <char>", "Input language", "en")
    .option("-o, --output <char>", "Output language", "zh-Hans")
// .option("");
// .option()

program.parse(process.argv); // 执行这个函数后 通过shell输入的指令参数才会被解析到options中

// 自定义选项处理 原理就跟reduce方法一个意思
const options = program.opts();
console.log(options);



