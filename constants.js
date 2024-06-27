const path = require("path");

const configPath = path.join(__dirname, './config.json');

// 默认支持的语言 语言code以百度平台的作为标准来统一
const supportLanguage = [
    { zh: "自动检测", en: "auto", code: "auto" },
    { zh: "中文", en: "chinese", code: "zh" },
    { zh: "英语", en: "english", code: "en" },
    { zh: "俄语", en: "russian", code: "ru" },
    { zh: "日语", en: "japanese", code: "jp" },
    { zh: "韩语", en: "korean", code: "kor" },
    { zh: "法语", en: "french", code: "fra" },
    { zh: "西班牙语", en: "spanish", code: "spa" },
    { zh: "泰语", en: "thai", code: "th" },
    { zh: "葡萄牙语", en: "portuguese", code: "pt" },
    { zh: "德语", en: "german", code: "de" },
    { zh: "意大利语", en: "italian", code: "it" },
    { zh: "繁体中文", en: "traditional_chinese", code: "cht" },
    { zh: "越南语", en: "vietnamese", code: "vie" },
    { zh: "荷兰语", en: "dutch", code: "nl" },
    { zh: "波兰语", en: "polish", code: "pl" },
]

module.exports = {
    configPath,
    supportLanguage
}