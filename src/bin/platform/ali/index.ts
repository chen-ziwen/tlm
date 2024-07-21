import alimt20181012, * as $alimt20181012 from "@alicloud/alimt20181012";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from '@alicloud/tea-util';
import { getPlatformConfig, matchPlatformLanguageCode, errorLog } from "@util/helpers";

export class Ali implements Tl.Methods {
    private mName: string;
    private mTitle: string;
    constructor(name: string) {
        this.mName = name;
        this.mTitle = "阿里翻译";
    }

    async translate(query: string[]) {
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
            .then(data => data.body?.data?.translated)
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
