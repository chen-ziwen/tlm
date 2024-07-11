// 腾讯翻译
import tencentCloud from "tencentcloud-sdk-nodejs-tmt";
import { getPlatformConfig, matchPlatformLanguageCode, errorLog } from "../../../util/helpers.js";
export default class Tencent {
    constructor(name) {
        this.mName = name;
        this.mTitle = "腾讯翻译";
    }

    printError(code) {
        const messages = {
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

        const message = this.mTitle + ": " + (messages[code] ||
            "请参考错误码：" + code + " [https://cloud.tencent.com/document/product/551/30637] ");
        errorLog(message);
    }

    async translate(query) {
        const TmtClient = tencentCloud.tmt.v20180321.Client;

        const { appid, key, source, target } = await getPlatformConfig(this.mName);
        const langCode = matchPlatformLanguageCode(this.mName, { source, target });
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
        })

        const params = {
            SourceText: query.join(" "),
            Source: langCode.source,
            Target: langCode.target,
            ProjectId: 0
        }

        return client.TextTranslate(params)
            .then(data => data.TargetText)
            .catch((err) => {
                this.printError(err.code);
            });
    }
}