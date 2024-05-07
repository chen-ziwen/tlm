// 阿里翻译
// 需求比较简单 直接使用sdk对接即可
const alimt20181012 = require("@alicloud/alimt20181012");
const OpenApi = require("@alicloud/openapi-client");
const Util = require("@alicloud/tea-util");
const { getPlatformConfig, errorLog } = require("../../util/helpers");

class Ali {
    constructor(name) {
        this.mName = name;
        this.mTitle = "阿里翻译";
    }

    async translate(query) {
        const { appid, key, from, to } = await getPlatformConfig(this.mName);

        const config = new OpenApi.Config({
            accessKeyId: appid,
            accessKeySecret: key
        });

        config.endpoint = "mt.aliyuncs.com";

        const client = new alimt20181012.default(config);

        const params = {
            formatType: "text",
            sourceLanguage: from,
            targetLanguage: to,
            sourceText: query.join(" "),
            scene: "general"
        };

        const translateGeneralRequest = new alimt20181012.TranslateGeneralRequest(params);
        const runtime = new Util.RuntimeOptions({});

        return client.translateGeneralWithOptions(translateGeneralRequest, runtime).
            then(data => {
                return data.body.data.translated;
            }).catch(err => {
                if (err) {
                    const { Message, Recommend } = err.data;
                    const message = `${this.mTitle}: ${Message} [${Recommend}]`;
                    errorLog(message);
                } else {
                    console.error(err)
                }
            })
    }
}

module.exports = Ali;