import { createRequire } from "node:module";
import { BasePlatform } from "@/platform/base";
import { PlatformError } from "@/utils/errors";

/**
 * 阿里云 SDK 是 CommonJS，且 1.4 起把依赖从 @alicloud/openapi-client 换成了
 * @alicloud/openapi-core。这里用 createRequire 加载，规避 ESM 命名导出的解析
 * 差异，并且只依赖最稳定的 translateGeneral 接口。
 */
const require = createRequire(import.meta.url);
const alimt = require("@alicloud/alimt20181012");
const { $OpenApiUtil } = require("@alicloud/openapi-core");

export default class Ali extends BasePlatform {
    protected readonly title = "阿里云翻译";
    protected readonly errorDoc = "https://help.aliyun.com/document_detail/158243.html";
    protected readonly errorMessages: Record<string, string> = {};

    async translate(query: string[]): Promise<string> {
        const { appid, key } = this.credentials();
        const { langCode } = this.context();

        const config = new $OpenApiUtil.Config({
            accessKeyId: appid,
            accessKeySecret: key,
            regionId: "cn-hangzhou"
        });
        config.endpoint = "mt.aliyuncs.com";

        const client = new alimt.default(config);
        if (typeof client.translateGeneral !== "function") {
            this.fail("当前阿里云 SDK 版本不受支持，请重新安装 tlm");
        }

        try {
            const response = await client.translateGeneral(new alimt.TranslateGeneralRequest({
                formatType: "text",
                sourceLanguage: langCode.source,
                targetLanguage: langCode.target,
                sourceText: query.join(" "),
                scene: "general"
            }));

            const translated = response?.body?.data?.translated;
            if (!translated) this.fail(response?.body?.message ?? "未返回翻译结果");

            return translated;
        } catch (error) {
            if (error instanceof PlatformError) throw error;

            const detail = (error as { data?: { Message?: string; Recommend?: string } })?.data;
            if (detail?.Message) {
                this.fail(`${detail.Message}${detail.Recommend ? ` [${detail.Recommend}]` : ""}`);
            }
            this.fail(error instanceof Error ? error.message : String(error));
        }
    }
}
