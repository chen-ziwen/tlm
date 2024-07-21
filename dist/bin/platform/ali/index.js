import alimt20181012, * as $alimt20181012 from "@alicloud/alimt20181012";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from '@alicloud/tea-util';
import { getPlatformConfig, matchPlatformLanguageCode, errorLog } from "../../../util/helpers.js";
export class Ali {
    constructor(name) {
        this.mName = name;
        this.mTitle = "阿里翻译";
    }
    async translate(query) {
        const { appid, key, source, target } = await getPlatformConfig(this.mName);
        const langCode = matchPlatformLanguageCode(this.mName, { source, target });
        const config = new $OpenApi.Config({
            accessKeyId: appid,
            accessKeySecret: key
        });
        config.endpoint = "mt.aliyuncs.com";
        const client = new alimt20181012(config);
        const params = {
            formatType: "text",
            sourceLanguage: langCode.source,
            targetLanguage: langCode.target,
            sourceText: query.join(" "),
            scene: "general"
        };
        const translateGeneralRequest = new $alimt20181012.TranslateGeneralRequest(params);
        const runtime = new $Util.RuntimeOptions({});
        return client.translateGeneralWithOptions(translateGeneralRequest, runtime)
            .then(data => { var _a, _b; return (_b = (_a = data.body) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.translated; })
            .catch(err => {
            if (err) {
                const { Message, Recommend } = err.data;
                const message = `${this.mTitle}: ${Message} [${Recommend}]`;
                errorLog(message);
            }
            else {
                console.error(err);
            }
        });
    }
}
