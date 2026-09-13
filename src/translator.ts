import { readConfig } from "@/config";
import { createAdapter } from "@/platform";

/**
 * 按当前配置的平台翻译文本。
 * 适配器在这一刻才被加载，因此启动 CLI 不依赖任何第三方平台 SDK。
 */
async function translate(query: string[]): Promise<string> {
    const { pl } = readConfig();
    const adapter = await createAdapter(pl);
    return adapter.translate(query);
}

export { translate };
