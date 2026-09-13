/** 翻译平台适配器必须实现的接口 */
interface Methods {
    translate: (query: string[]) => Promise<string>;
}

/** 单个平台的凭据信息 */
interface PlatformConfig {
    appid: string;
    key: string;
}

/** 用户配置文件 ~/.tlmrc.json 的结构 */
interface Config {
    pl: string;
    source: string;
    target: string;
    platform: Record<string, PlatformConfig>;
}

/** 平台凭据 + 当前语种，适配器运行时用到的完整上下文 */
interface RuntimeConfig extends PlatformConfig {
    source: string;
    target: string;
}

/** 某个语种作为源/目标时的可用性规则 */
interface LangRule {
    strategy: "exclude" | "include";
    language: string[];
}

/** 单个平台的语种映射表 */
interface LangsConfig {
    codeMap: Record<string, string>;
    sourceMap: LangRule;
    targetMap: Record<string, LangRule>;
}

interface DefaultLangs {
    source: string;
    target: string;
}

export type {
    Methods,
    PlatformConfig,
    Config,
    RuntimeConfig,
    LangRule,
    LangsConfig,
    DefaultLangs
};
