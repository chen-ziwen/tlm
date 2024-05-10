const path = require("path");

const configPath = path.join(__dirname, './config.json');

// 支持的语言
const commonLanguage = {
    "自动检测": ['auto'],
    "中文": ['zh'],
    "英语": ['en'],
    "俄语": ["ru"],
    "日语": ['jp'],
    "韩语": ['kro'],
    "法语": ['fra'],
    "西班牙语": ['spa'],
    "泰语": ['th'],
    "葡萄牙语": ['pt'],
    "德语": ['de'],
    "意大利语": ['yue'],
    "繁体中文": ['cht'],
    "越南语": ['vie'],
    "荷兰语": ['nl'],
    "波兰语": ['pl'],
}

module.exports = {
    configPath,
    commonLanguage
}