// 百度翻译
const MD5 = require("crypto-js/md5");
const { getPlatformConfig, errorLog } = require("../../util/helpers");

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

    printError(code) {
        const messages = {
            54000: "缺少必填的参数",
            58001: "不支持的语言类型",
            54005: "翻译文本过长",
            52003: "应用ID无效",
            58002: "无相关服务的有效实例",
            90107: "开发者账号无效",
            54001: "签名检验失败,检查 KEY 和 SECRET",
            54004: "账户已经欠费",
            54003: "访问频率受限",
        };

        const message = this.mTitle + ": " + (messages[code] ||
            "请参考错误码：" + code + " [https://api.fanyi.baidu.com/doc/21] ");
        errorLog(message);
    }

    async translate(query) {
        const url = await this.url(query);
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                const { error_code: ec, trans_result: rs } = data;
                if (ec) {
                    return this.printError(ec);
                } else {
                    return rs[0].dst;
                }
            })
            .catch((err) => console.error(err));
    }

}

module.exports = Baidu;