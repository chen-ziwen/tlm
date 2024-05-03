// 有道翻译
const Core = require("./core");
const fetch = require("node-fetch");
const sha256 = require("crypto-js/sha256");

class Youdao extends Core {
    constructor() {
        super("youdao");
        this.mTitle = "有道翻译";
    }

    async url(query) {
        const { appid, key, from, to } = await this.getPlatformConfig();
        const salt = this.generalUuidv4();
        const q = query.join(" ");
        const curtime = Math.round(new Date().getTime() / 1000);
        const sign = sha256(appid + this.getTruncate(q) + salt + curtime + key);

        const params = new URLSearchParams({
            q,
            from,
            to,
            appKey: appid,
            salt,
            sign,
            signType: "v3",
            curtime
        });
        return "https://openapi.youdao.com/api?" + params.toString();

    }

    async translate(query) {
        const url = await this.url(query);
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                return data.translation.join(",");
            })
            .catch((err) => console.error(err));
    }
}

module.exports = Youdao;
