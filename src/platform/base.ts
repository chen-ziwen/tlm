import fetch, { RequestInit } from "node-fetch";
import { getPlatformConfig } from "@/config";
import { matchPlatformLanguageCode } from "@/platform";
import type { DefaultLangs, Methods, PlatformConfig, RuntimeConfig } from "@/types";
import { PlatformError } from "@/utils/errors";

/**
 * 平台适配器基类：收敛各平台重复的凭据校验、语种映射和错误提示。
 */
abstract class BasePlatform implements Methods {
    /** 用于错误提示的中文名，如 "有道翻译" */
    protected abstract readonly title: string;
    /** 平台错误码 -> 中文说明 */
    protected abstract readonly errorMessages: Record<string, string>;
    /** 遇到未收录错误码时指向的官方文档 */
    protected abstract readonly errorDoc: string;

    constructor(protected readonly pl: string) { }

    /** 凭据 + 当前语种 + 平台侧语种代码 */
    protected context(): RuntimeConfig & { langCode: DefaultLangs } {
        const config = getPlatformConfig(this.pl);
        return { ...config, langCode: matchPlatformLanguageCode(this.pl, config) };
    }

    /** 需要凭据的平台调用；未配置时给出可直接照抄的命令 */
    protected credentials(): PlatformConfig {
        const { appid, key } = getPlatformConfig(this.pl);
        if (!appid || !key) {
            throw new PlatformError(`${this.title}尚未配置应用ID和密钥，请先执行 \`tlm set-trl ${this.pl} -a <appid> -s <key>\``);
        }
        return { appid, key };
    }

    protected fail(message: string): never {
        throw new PlatformError(`${this.title}: ${message}`);
    }

    protected failWithCode(code: string): never {
        this.fail(this.errorMessages[code] ?? `请参考错误码：${code} [${this.errorDoc}]`);
    }

    /** 发起请求并拿到原始响应体，网络异常统一转成可读提示 */
    protected async request(url: string, init?: RequestInit): Promise<string> {
        try {
            const response = await fetch(url, init);
            return await response.text();
        } catch (error) {
            this.fail(`网络请求失败：${error instanceof Error ? error.message : error}`);
        }
    }

    protected async requestJson(url: string, init?: RequestInit): Promise<any> {
        const text = await this.request(url, init);
        try {
            return JSON.parse(text);
        } catch {
            this.fail(`返回内容无法解析：${text.slice(0, 200)}`);
        }
    }

    abstract translate(query: string[]): Promise<string>;
}

export { BasePlatform };
