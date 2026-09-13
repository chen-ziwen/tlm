import { BasePlatform } from "@/platform/base";

export default class Google extends BasePlatform {
    protected readonly title = "谷歌翻译";
    protected readonly errorDoc = "";
    protected readonly errorMessages: Record<string, string> = {};

    /** 谷歌翻译走免密钥的公开接口，不需要凭据 */
    async translate(query: string[]): Promise<string> {
        const { langCode } = this.context();
        const params = new URLSearchParams({
            client: "gtx",
            tl: langCode.target,
            sl: langCode.source,
            dt: "t",
            q: query.join(" ")
        });

        const data = await this.requestJson("https://translate.google.com/translate_a/single?" + params);
        const result = data?.[0]?.[0]?.[0];

        if (typeof result !== "string") {
            this.fail("未能解析翻译结果，通常是网络无法访问谷歌翻译（需要开启代理或代理的 Tun 模式）");
        }

        return result;
    }
}
