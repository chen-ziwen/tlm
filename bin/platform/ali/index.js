// 阿里翻译
const alimt20181012 = require("@alicloud/alimt20181012");
const OpenApi = require("@alicloud/openapi-client");
const { getPlatformConfig, errorLog } = require("../../../util/helpers");

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

        return client.translateGeneralWithOptions(translateGeneralRequest, {})
            .then(data => data.body.data.translated)
            .catch(err => {
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