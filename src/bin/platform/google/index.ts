import { getPlatformConfig, matchPlatformLanguageCode } from "@util/helpers";
import fetch from "node-fetch";

export class Google implements Tl.Methods {
    private mName: string;
    private mTitle: string;
    constructor(name: string) {
        this.mName = name;
        this.mTitle = "谷歌翻译";
    }

    async url(query: string[]) {
        const { source, target } = await getPlatformConfig(this.mName);
        const langCode = matchPlatformLanguageCode(this.mName, { source, target });
        const params = new URLSearchParams({
            client: "gtx",
            tl: langCode.source,
            sl: langCode.target,
            dt: "t",
            q: query.join(" "),
        });

        return "https://translate.google.com/translate_a/single?" + params.toString();
    }

    async translate(query: string[]) {
        const url = await this.url(query);
        return fetch(url)
            .then(res => res.json())
            .then((data: any) => {
                return data[0]?.[0]?.[0];
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
