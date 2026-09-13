import { CONFIG_PATH, DEFAULT_LANGUAGE, TLMRC } from "@/constants";
import { PLATFORM_KEYS } from "@/platform";
import type { Config, PlatformConfig, RuntimeConfig } from "@/types";
import { exist, readJson, writeJson } from "@/utils/io";
import { errorLog } from "@/utils/log";

/** 进程内缓存：一次 CLI 运行只读一次磁盘，也避免同一条告警被重复打印 */
let cached: Config | undefined;

function emptyCredentials(): PlatformConfig {
    return { appid: "", key: "" };
}

/** 平台清单以注册表为准，这里只补齐凭据字段 */
function defaultConfig(): Config {
    const bundled = readJson<Config>(CONFIG_PATH);
    const platform: Record<string, PlatformConfig> = {};

    for (const key of PLATFORM_KEYS) {
        const defined = bundled?.platform?.[key];
        platform[key] = { appid: defined?.appid ?? "", key: defined?.key ?? "" };
    }

    return {
        pl: bundled?.pl ?? PLATFORM_KEYS[0],
        source: bundled?.source ?? DEFAULT_LANGUAGE.source,
        target: bundled?.target ?? DEFAULT_LANGUAGE.target,
        platform
    };
}

/**
 * 用户可能手改配置文件把 pl 写坏，这里统一兜底，
 * 免得所有命令都拿到一个不存在的平台名。
 */
function withValidPlatform(config: Config, fallback: string): Config {
    if (PLATFORM_KEYS.includes(config.pl)) return config;

    errorLog(`配置中的平台 \`${config.pl}\` 不受支持，本次回退为 \`${fallback}\`，可执行 \`tlm use <平台>\` 重新选择`);
    config.pl = fallback;
    return config;
}

/** 把包内默认配置与用户配置合并，顺带丢掉不再使用的残留字段 */
function mergeLocalConfig(base: Config): Config {
    const local = readJson<Partial<Config>>(TLMRC);
    if (!local) {
        errorLog(`配置文件 ${TLMRC} 无法解析，本次使用默认配置`);
        return withValidPlatform(base, PLATFORM_KEYS[0]);
    }

    const config: Config = {
        pl: local.pl || base.pl,
        source: local.source || base.source,
        target: local.target || base.target,
        platform: { ...base.platform }
    };

    for (const [key, value] of Object.entries(local.platform ?? {})) {
        config.platform[key] = {
            appid: value?.appid ?? "",
            key: value?.key ?? ""
        };
    }

    return withValidPlatform(config, base.pl);
}

/**
 * 读取用户配置。文件不存在、字段缺失或残留未知字段时都会归一化，
 * 保证首次安装后无需任何配置文件也能正常执行 `tlm ls` / `tlm p`。
 */
function readConfig(): Config {
    if (cached) return cached;

    const base = defaultConfig();
    const config = exist(TLMRC) ? mergeLocalConfig(base) : withValidPlatform(base, PLATFORM_KEYS[0]);
    cached = config;

    return config;
}

function writeConfig(config: Config): void {
    writeJson(TLMRC, config);
    cached = config;
}

/** 读-改-写收口，省得每个命令都手写一遍三行样板 */
function updateConfig(mutate: (config: Config) => void): void {
    const config = readConfig();
    mutate(config);
    writeConfig(config);
}

function getPlatformConfig(name: string): RuntimeConfig {
    const config = readConfig();
    const platform = config.platform[name] ?? emptyCredentials();
    return { ...platform, source: config.source, target: config.target };
}

export {
    readConfig,
    writeConfig,
    updateConfig,
    getPlatformConfig
};
