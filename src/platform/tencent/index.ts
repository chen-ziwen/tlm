import tencentCloud from "tencentcloud-sdk-nodejs-tmt";
import { BasePlatform } from "@/platform/base";

export default class Tencent extends BasePlatform {
    protected readonly title = "腾讯云翻译";
    protected readonly errorDoc = "https://cloud.tencent.com/document/product/551/30637";
    protected readonly errorMessages: Record<string, string> = {
        "MissingParameter": "缺少必填的参数",
        "UnsupportedOperation.UnsupportedLanguage": "不支持的语言类型",
        "UnsupportedOperation.TextTooLong": "翻译文本过长",
        "FailedOperation.UserNotRegistered": "服务未开通，请在腾讯云官网机器翻译控制台开通服务",
        "FailedOperation.StopUsing": "账号已停服",
        "AuthFailure.SignatureFailure": "签名检验失败，检查KEY和SECRET",
        "FailedOperation.ServiceIsolate": "账户已经欠费",
        "FailedOperation.NoFreeAmount": "本月免费额度已用完",
        "RequestLimitExceeded": "访问频率受限",
    };

    async translate(query: string[]): Promise<string> {
        const { appid, key } = this.credentials();
        const { langCode } = this.context();

        const TmtClient = tencentCloud.tmt.v20180321.Client;
        const client = new TmtClient({
            credential: {
                secretId: appid,
                secretKey: key
            },
            region: "ap-shanghai",
            profile: {
                signMethod: "TC3-HMAC-SHA256",
                httpProfile: {
                    reqMethod: "POST",
                    reqTimeout: 30,
                    headers: {
                        "content-type": "application/json"
                    }
                }
            }
        });

        try {
            const data = await client.TextTranslate({
                SourceText: query.join(" "),
                Source: langCode.source,
                Target: langCode.target,
                ProjectId: 0
            });
            if (!data.TargetText) this.fail("未返回翻译结果");

            return data.TargetText;
        } catch (error) {
            const code = (error as { code?: string })?.code;
            if (code && this.errorMessages[code]) this.fail(this.errorMessages[code]);
            this.fail(error instanceof Error ? error.message : String(error));
        }
    }
}
