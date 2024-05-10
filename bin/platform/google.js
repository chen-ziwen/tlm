// 谷歌翻译
// export function translate(sl, tl, raw) {
//     return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${raw}`)
//         .then(res => res.json())
//         .then(res => {
//             return res?.[0]?.[0]?.[0] || "";
//         });
// }

/* https://github.com/matheuss/google-translate-api */

const https = require("https");
const { getPlatformConfig } = require("../../util/helpers");

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
})

class Google {
    constructor(name) {
        this.mName = name;
        this.mTitle = "谷歌翻译";

    }

    async url(query) {
        const { to, from } = await getPlatformConfig(this.mName);
        const params = new URLSearchParams({
            client: "gtx",
            sl: "en",
            tl: "zh-Hans",
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            q: query.join(" "),
        });

        return "https://translate.google.com/translate_a/single?" + params.toString();
    }

    async translate(query) {
        const url = await this.url(query);
        console.log('url ===>', url);
        return fetch(url, { agent: httpsAgent })
            .then(res => res.json())
            .then(data => {
                console.log('data==>', data);
            })
            .catch((err) => {
                console.error(err)
            });
    }
}

module.exports = Google;