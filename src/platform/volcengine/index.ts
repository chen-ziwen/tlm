import { Signer } from "@volcengine/openapi";
import { BasePlatform } from "@/platform/base";

export default class Volcengine extends BasePlatform {
    protected readonly title = "火山翻译";
    protected readonly errorDoc = "https://www.volcengine.com/docs/4640/65067";
    protected readonly errorMessages: Record<string, string> = {};

    async translate(query: string[]): Promise<string> {
        const { appid, key } = this.credentials();
        const { langCode } = this.context();

        const signer = new Signer({
            method: "POST",
            region: "cn-north-1",
            params: {
                Action: "TranslateText",
                Version: "2020-06-01",
            },
        }, "translate");
        const signedQueryString = signer.getSignUrl({
            accessKeyId: appid,
            secretKey: key,
            sessionToken: "",
        });

        const data = await this.requestJson("https://translate.volcengineapi.com/?" + signedQueryString, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                SourceLanguage: langCode.source,
                TargetLanguage: langCode.target,
                TextList: [query.join(" ")]
            }),
        });

        const detail = data?.ResponseMetadata?.Error;
        if (detail) this.fail(detail.Message ?? JSON.stringify(detail));

        return data.TranslationList?.[0]?.Translation ?? "";
    }
}
