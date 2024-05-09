// 火山翻译
// 没有提供nodejs的翻译相关的sdk调用方式，只能走api请求。
const { Signer } = require("@volcengine/openapi");
const { getPlatformConfig, getFormattedUTCDate } = require("../../../util/helpers");

class Volcengine {
    constructor(name) {
        this.mName = name;
        this.mTitle = "火山翻译";
    }


    async translate() {
        const { to, from, appid, key } = await getPlatformConfig(this.mName);
        const openApiRequestData = {
            method: "POST",
            region: "cn-north-1",
            params: {
                Action: "TranslateText",
                Version: "2020-06-01",
                RoleTrn: "trn:iam::200:role/STSRole",
                RoleSessionName: "test",
            },
        }

        const credentials = {
            accessKeyId: appid,
            secretKey: key,
            sessionToken: "",
        }

        const signer = new Signer(openApiRequestData, "sts");
        const signedQueryString = signer.getSignUrl(credentials);
        console.log(signedQueryString);
        const url = "translate.volcengineapi.com";

    }

}

module.exports = Volcengine;
