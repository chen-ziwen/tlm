// 腾讯翻译
// 腾讯云sdk翻译模块
const tencentCloud = require("tencentcloud-sdk-nodejs-tmt");
const { getPlatformConfig } = require("../../util/helpers");

class Tenxun {
    constructor(name) {
        this.mName = name;
        this.mTitle = "腾讯翻译";
    }

    async translate(query) {
        const TmtClient = tencentCloud.tmt.v20180321.Client;

        const { appid, key, from, to } = await getPlatformConfig(this.mName);

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
            Source: from,
            Target: to,
            ProjectId: 0
        }

        return client.TextTranslate(params)
            .then(data => data.TargetText)
            .catch((err) => console.err(err));
    }
}

module.exports = Tenxun;