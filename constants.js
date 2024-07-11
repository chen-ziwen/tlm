const path = require("path");

const configPath = path.join(__dirname, './config.json');

// 采用ISO 639-1标准语言代码，除了一些特殊语言
const supportLanguage = [
    { zh: "自动检测", en: "auto", code: "auto" },
    { zh: "中文", en: "chinese", code: "zh" },
    { zh: "繁体中文", en: "traditional_chinese", code: "cht" },
    { zh: "英语", en: "english", code: "en" },
    { zh: "俄语", en: "russian", code: "ru" },
    { zh: "日语", en: "japanese", code: "ja" },
    { zh: "韩语", en: "korean", code: "ko" },
    { zh: "德语", en: "german", code: "de" },
    { zh: "法语", en: "french", code: "fr" },
    { zh: "西班牙语", en: "spanish", code: "es" },
    { zh: "意大利语", en: "italian", code: "it" },
    { zh: "葡萄牙语", en: "portuguese", code: "pt" },
    { zh: "泰语", en: "thai", code: "th" },
];

// 默认翻译的源语言和目标语言
const defaultLanguage = {
    source: "auto",
    target: "zh"
}

module.exports = {
    configPath,
    supportLanguage,
    defaultLanguage
}