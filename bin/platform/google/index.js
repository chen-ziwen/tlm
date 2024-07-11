
import { getPlatformConfig, matchPlatformLanguageCode } from "../../../util/helpers.js";
// 谷歌翻译必须翻墙才能使用 翻墙支持浏览器和部分遵循系统代理的软件
// 本包不支持直接使用 需要翻墙 且需要开启tun模式劫持所有的请求走代理
export default class Google {
    constructor(name) {
        this.mName = name;
        this.mTitle = "谷歌翻译";
    }

    async url(query) {
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

    async translate(query) {
        const url = await this.url(query);
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                return data[0]?.[0]?.[0];
            })
            .catch((err) => {
                console.error(err)
            });
    }
}
