import { Signer } from "@volcengine/openapi";
import { getPlatformConfig, matchPlatformLanguageCode, errorLog } from "../../../util/helpers.js";

export class Volcengine {
    constructor(name) {
        this.mName = name;
        this.mTitle = "火山翻译";
    }

    async url() {
        const { appid, key } = await getPlatformConfig(this.mName);

        const openApiRequestData = {
            method: "POST",
            region: "cn-north-1",
            params: {
                Action: "TranslateText",
                Version: "2020-06-01",
            },
        }
        const credentials = {
            accessKeyId: appid,
            secretKey: key,
            sessionToken: "",
        }

        const signer = new Signer(openApiRequestData, "translate");
        const signedQueryString = signer.getSignUrl(credentials);

        return 'https://translate.volcengineapi.com/?' + signedQueryString;
    }

    async translate(query) {
        const { source, target } = await getPlatformConfig(this.mName);
        const langCode = matchPlatformLanguageCode(this.mName, { source, target });
        const url = await this.url();

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                SourceLanguage: langCode.source,
                TargetLanguage: langCode.target,
                TextList: [query.join(" ")]
            }),
        })
            .then(res => res.text())
            .then(res => {
                const data = JSON.parse(res);
                if (data.ResponseMetadata.Error) {
                    const message = this.mTitle + ": " + data.ResponseMetadata.Error.Message;
                    return errorLog(message);
                }
                return data.TranslationList[0].Translation;
            })
    }
}

