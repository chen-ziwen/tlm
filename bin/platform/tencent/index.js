// 腾讯翻译
const tencentCloud = require("tencentcloud-sdk-nodejs-tmt");
const { getPlatformConfig, errorLog, matchPlatformLanguageCode } = require("../../../util/helpers");

class Tencent {
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

        const { appid, key, from, to } = await getPlatformConfig(this.mName);
        const langCode = matchPlatformLanguageCode(this.mName, { from, to });
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
            Source: langCode.from,
            Target: langCode.to,
            ProjectId: 0
        }

        return client.TextTranslate(params)
            .then(data => data.TargetText)
            .catch((err) => {
                this.printError(err.code);
            });
    }
}

module.exports = Tencent;