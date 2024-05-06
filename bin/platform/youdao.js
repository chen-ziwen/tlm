// 有道翻译
const sha256 = require("crypto-js/sha256");
const { errorLog } = require("../../util/helpers");
const {
    getPlatformConfig,
    generalUuidv4,
    getTruncate
} = require("../../util/helpers");


class Youdao {
    constructor(name) {
        this.mName = name;
        this.mTitle = "有道翻译";
    }

    async url(query) {
        const { appid, key, from, to } = await getPlatformConfig(this.mName);
        const salt = Date.now();
        const q = query.join(" ");
        const curtime = Math.round(new Date().getTime() / 1000);
        const sign = sha256(appid + getTruncate(q) + salt + curtime + key);

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

    printError(code) {
        const messages = {
            101: "缺少必填的参数",
            102: "不支持的语言类型",
            103: "翻译文本过长",
            108: "应用ID无效",
            110: "无相关服务的有效实例",
            111: "开发者账号无效",
            112: "请求服务无效",
            113: "查询为空",
            202: "签名检验失败,检查 KEY 和 SECRET",
            401: "账户已经欠费",
            411: "访问频率受限",
        };

        const message = this.mTitle + ": " + messages[code] || "请参考错误码：" + code;
        errorLog(message);
    }

    async translate(query) {
        const url = await this.url(query);
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.errorCode !== "0") {
                    return this.printError(data.errorCode);
                }
                return data.translation.join("");
            })
            .catch((err) => {
                this.printError(err);
            });
    }

}

module.exports = Youdao;
