import ali from "@/platform/ali/langs";
import baidu from "@/platform/baidu/langs";
import google from "@/platform/google/langs";
import tencent from "@/platform/tencent/langs";
import volcengine from "@/platform/volcengine/langs";
import youdao from "@/platform/youdao/langs";
import type { DefaultLangs, LangRule, LangsConfig, Methods } from "@/types";
import { PlatformError } from "@/utils/errors";
import { isLowerCaseEqual } from "@/utils/text";

type AdapterConstructor = new (pl: string) => Methods;

interface PlatformEntry {
    /** 列表里显示的完整名，如 "有道-youdao" */
    name: string;
    /** 该平台的语种映射表，纯数据无副作用 */
    langs: LangsConfig;
    /** 惰性加载器：只有真正要翻译时才把适配器拉起来 */
    load: () => Promise<{ default: AdapterConstructor }>;
}

/**
 * 唯一的平台清单。加一个平台 = 新增平台目录 + 在这里加一行。
 * 适配器走动态导入，所以某个平台的依赖出问题只会影响该平台，
 * 不会让 `tlm ls` 之类的命令一起崩掉。
 */
const REGISTRY: Record<string, PlatformEntry> = {
    youdao: { name: "有道-youdao", langs: youdao, load: () => import("@/platform/youdao") },
    baidu: { name: "百度-baidu", langs: baidu, load: () => import("@/platform/baidu") },
    tencent: { name: "腾讯云-tencent", langs: tencent, load: () => import("@/platform/tencent") },
    ali: { name: "阿里云-ali", langs: ali, load: () => import("@/platform/ali") },
    volcengine: { name: "火山-volcengine", langs: volcengine, load: () => import("@/platform/volcengine") },
    google: { name: "谷歌-google", langs: google, load: () => import("@/platform/google") }
};

const PLATFORM_KEYS = Object.keys(REGISTRY);

/** 忽略大小写地把用户输入解析为注册表里的平台名 */
function findPlatform(name: string): string | undefined {
    return PLATFORM_KEYS.find(key => isLowerCaseEqual(key, name));
}

/** "有道-youdao" */
function platformName(key: string): string {
    return REGISTRY[key]?.name ?? key;
}

/** "有道" */
function platformShortName(key: string): string {
    return platformName(key).split("-")[0];
}

function platformLangs(key: string): LangsConfig {
    const langs = REGISTRY[key]?.langs;
    if (!langs) throw new PlatformError(`缺少 \`${key}\` 平台的语种配置`);
    return langs;
}

/** 把统一的语种代码转换成某个平台自己的代码 */
function matchPlatformLanguageCode(key: string, { source, target }: DefaultLangs): DefaultLangs {
    const { codeMap } = platformLangs(key);
    const sourceCode = codeMap[source];
    const targetCode = codeMap[target];

    if (sourceCode === undefined || targetCode === undefined) {
        throw new PlatformError(`\`${key}\` 平台不支持当前语种组合（${source} -> ${target}），请使用 \`tlm set-langs\` 重新设置`);
    }

    return { source: sourceCode, target: targetCode };
}

/** 判断某个语种在给定规则下是否可用 */
function isLanguageSupported(rule: LangRule, code: string): boolean {
    return rule.language.includes(code) === (rule.strategy === "include");
}

async function createAdapter(key: string): Promise<Methods> {
    const entry = REGISTRY[key];
    if (!entry) {
        throw new PlatformError(`不支持 \`${key}\` 翻译平台，请使用 \`tlm ls\` 查看可支持的平台`);
    }

    let loaded: { default: AdapterConstructor };
    try {
        loaded = await entry.load();
    } catch (error) {
        throw new PlatformError(`${entry.name}适配器加载失败：${error instanceof Error ? error.message : error}`);
    }

    return new loaded.default(key);
}

export {
    PLATFORM_KEYS,
    findPlatform,
    platformName,
    platformShortName,
    platformLangs,
    matchPlatformLanguageCode,
    isLanguageSupported,
    createAdapter
};
