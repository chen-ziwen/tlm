const path = require("path");

const configPath = path.join(__dirname, './config.json');

// 全部支持的语言和统一的代码名词（使用百度翻译的代码名称作为切换名）
const supportLanguage = {
    "auto": { zh: "自动检测", en: "auto" },
    "zh": { zh: "中文", en: "chinese" },
    "en": { zh: "英语", en: "english" },
    "ru": { zh: "俄语", en: "russian" },
    "jp": { zh: "日语", en: "japanese" },
    "kor": { zh: "韩语", en: "korean" },
    "fra": { zh: "法语", en: "french" },
    "spa": { zh: "西班牙语", en: "spanish" },
    "th": { zh: "泰语", en: "thai" },
    "pt": { zh: "葡萄牙语", en: "portuguese" },
    "de": { zh: "德语", en: "german" },
    "it": { zh: "意大利语", en: "italian" },
    "cht": { zh: "繁体中文", en: "traditional_chinese" },
    "vie": { zh: "越南语", en: "vietnamese" },
    "nl": { zh: "荷兰语", en: "dutch" },
    "pl": { zh: "波兰语", en: "polish" },
}

// 支持的语言详细信息
const commonLanguage = {
    "自动检测": {
        "baidu": {
            key: "auto",
            exclude: [],
        },
        "ali": {
            key: "auto",
            exclude: [],
        },
        "tencent": {
            key: "auto",
            exclude: [],
        },
        "youdao": {
            key: "auto",
            exclude: [],
        },
        "volcengine": {
            key: "",
            exclude: [],
        },
        "google": {
            key: "auto",
            exclude: [],
        },
    },
    "中文": { "baidu": "auto", "ali": "auto", "tencent": "auto", "youdao": "auto", "volcengine": "", "google": "" },
    "英语": { "baidu": "en", "ali": "en", "tencent": "en", "youdao": "en", "volcengine": "", "google": "" },
    "俄语": { "baidu": "run", "ali": "run", "tencent": "run", "youdao": "run", "volcengine": "", "google": "" },
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
    supportLanguage,
    commonLanguage
}