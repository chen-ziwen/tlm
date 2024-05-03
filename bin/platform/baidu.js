// 百度翻译
const Core = require('./core');
const MD5 = require("md5")
const fetch = require("node-fetch");

class Baidu extends Core {
    constructor() {
        super("baidu");
        this.mTitle = "百度翻译";
    }

    async url(query) {
        const { appid, key, from, to } = await this.getPlatformConfig();
        const salt = this.generalUuidv4();
        const q = query.join(" ");
        const sign = MD5(appid + q + salt + key);

        const params = new URLSearchParams({
            q,
            from,
            to,
            appid,
            salt,
            sign
        });

        return "https://fanyi-api.baidu.com/api/trans/vip/translate?" + params.toString();
    }

    errorLog() {

    }
    
    async translate(query) {
        const url = await this.url(query);
        return fetch(url)
            .then(res => res.json())
            .then(data => data["trans_result"][0].dst)
            .catch((err) => console.error(err));
    }

}

module.exports = Baidu;