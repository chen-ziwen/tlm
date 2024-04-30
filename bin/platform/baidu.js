// 百度翻译
const Driver = require('./driver');
const MD5 = require("md5")
const fetch = require("node-fetch");

class Baidu extends Driver {
    constructor() {
        super();
        this.url = "https://fanyi-api.baidu.com/api/trans/vip/translate?"
    }
    // 这边参数得处理普通字符串和数组类型
    // 数组类型就是句子形式
    async translate(query, config) {
        const { appid, key, from, to } = config;
        const salt = Date.now();
        const sign = MD5(appid + query + salt + key);

        const params = {
            q: query,
            from,
            to,
            appid,
            salt,
            sign
        };

        for (let q in params) {
            this.url += `${q}=${params[q]}&`
        }

        this.url = this.url.slice(0, this.url.length - 1);
        this.url = encodeURI(this.url);

        // 简单处理 后续还要优化
        return fetch(this.url)
            .then(res => res.json())
            .then(data => {
                const q = data["trans_result"][0].dst;
                return q;
            })
            .catch((err) => console.error(err));
    }
}


module.exports = Baidu;