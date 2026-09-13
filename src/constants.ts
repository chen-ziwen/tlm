import type { DefaultLangs } from "@/types";

import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.join(CURRENT_DIR, "..");

const CONFIG_PATH = path.join(PACKAGE_ROOT, "config.json");
const PACKAGE_PATH = path.join(PACKAGE_ROOT, "package.json");
const TLMRC = path.join(os.homedir(), ".tlmrc.json");

const LANGUAGE_MAP = [
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

const LANGUAGE_ZH = {
    source: "源语言",
    target: "目标语言"
};

const DEFAULT_LANGUAGE: DefaultLangs = {
    source: "auto",
    target: "zh"
};

export {
    TLMRC,
    CONFIG_PATH,
    PACKAGE_PATH,
    LANGUAGE_ZH,
    LANGUAGE_MAP,
    DEFAULT_LANGUAGE
};
