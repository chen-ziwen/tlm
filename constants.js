const path = require("path");

const configPath = path.join(__dirname, './config.json');

// 默认支持的语言
const supportLanguage = [
    { zh: "自动检测", en: "auto" },
    { zh: "中文", en: "chinese" },
    { zh: "英语", en: "english" },
    { zh: "俄语", en: "russian" },
    { zh: "日语", en: "japanese" },
    { zh: "韩语", en: "korean" },
    { zh: "法语", en: "french" },
    { zh: "西班牙语", en: "spanish" },
    { zh: "泰语", en: "thai" },
    { zh: "葡萄牙语", en: "portuguese" },
    { zh: "德语", en: "german" },
    { zh: "意大利语", en: "italian" },
    { zh: "繁体中文", en: "traditional_chinese" },
    { zh: "越南语", en: "vietnamese" },
    { zh: "荷兰语", en: "dutch" },
    { zh: "波兰语", en: "polish" },
]

module.exports = {
    configPath,
    supportLanguage
}