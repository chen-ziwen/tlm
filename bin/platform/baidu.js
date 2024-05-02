// 百度翻译
const Core = require('./core');
const MD5 = require("md5")
const fetch = require("node-fetch");

class Baidu extends Core {
    constructor() {
        super("baidu");
        this.mTitle = "百度翻译";
    }

    async translate(query) {
        const { appid, key, from, to } = await this.getPlatformConfig();
        const salt = Date.now();
        const q = query.join(" ");
        const sign = MD5(appid + q + salt + key);
        let url = "https://fanyi-api.baidu.com/api/trans/vip/translate?";

        const params = {
            q,
            from,
            to,
            appid,
            salt,
            sign
        };

        for (let q in params) {
            url += `${q}=${params[q]}&`
        }

        url = url.slice(0, url.length - 1);
        url = encodeURI(url);

        return fetch(url)
            .then(res => res.json())
            .then(data => data["trans_result"][0].dst)
            .catch((err) => console.error(err));
    }

}


module.exports = Baidu;