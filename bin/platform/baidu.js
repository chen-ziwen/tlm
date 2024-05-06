// 百度翻译
const MD5 = require("crypto-js/md5");
const { getPlatformConfig, generalUuidv4 } = require("../../util/helpers");

class Baidu {
    constructor(name) {
        this.mName = name;
        this.mTitle = "百度翻译";
    }

    async url(query) {
        const { appid, key, from, to } = await getPlatformConfig(this.mName);
        const salt = Date.now();
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