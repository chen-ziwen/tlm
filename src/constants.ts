import { fileURLToPath } from 'url';
import path from "path";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
const configPath = path.join(__dirname, '../config.json');
const packagePath = path.join(__dirname, '../package.json');

// 采用ISO 639-1标准语言代码，除了一些特殊语言，例如繁体中文
const supportLanguage: Tl.SupportLangs[] = [
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

const languageZh = {
    source: "源语言",
    target: "目标语言"
}

const defaultLanguage: Tl.DefaultLangs = {
    source: "auto",
    target: "zh"
};


export {
    configPath,
    packagePath,
    languageZh,
    supportLanguage,
    defaultLanguage
}