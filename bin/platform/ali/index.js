// 阿里翻译

import alimt20181012 from "@alicloud/alimt20181012";
import OpenApi from "@alicloud/openapi-client";
import { getPlatformConfig, matchPlatformLanguageCode, errorLog } from "../../../util/helpers.js";

export class Ali {
    constructor(name) {
        this.mName = name;
        this.mTitle = "阿里翻译";
    }

    async translate(query) {
        const { appid, key, source, target } = await getPlatformConfig(this.mName);
        const langCode = matchPlatformLanguageCode(this.mName, { source, target });
        const config = new OpenApi.Config({
            accessKeyId: appid,
            accessKeySecret: key
        });

        config.endpoint = "mt.aliyuncs.com";

        const client = new alimt20181012.default(config);

        const params = {
            formatType: "text",
            sourceLanguage: langCode.source,
            targetLanguage: langCode.target,
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
