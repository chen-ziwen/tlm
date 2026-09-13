import sha256 from "crypto-js/sha256.js";
import { BasePlatform } from "@/platform/base";

export default class Youdao extends BasePlatform {
    protected readonly title = "有道翻译";
    protected readonly errorDoc = "https://ai.youdao.com/DOCSIRMA/html/trans/api/wbfy/index.html";
    protected readonly errorMessages: Record<string, string> = {
        101: "缺少必填的参数",
        102: "不支持的语言类型",
        103: "翻译文本过长",
        108: "应用ID无效",
        110: "无相关服务的有效实例",
        111: "开发者账号无效",
        112: "请求服务无效",
        113: "查询为空",
        202: "签名检验失败，检查KEY和SECRET",
        401: "账户已经欠费",
        411: "访问频率受限",
    };

    /** 有道签名规则：文本超过 20 字符时截断为「前10 + 长度 + 后10」 */
    private truncate(text: string): string {
        const len = text.length;
        return len <= 20 ? text : text.slice(0, 10) + len + text.slice(-10);
    }

    async translate(query: string[]): Promise<string> {
        const { appid, key } = this.credentials();
        const { langCode } = this.context();
        const q = query.join(" ");
        const salt = Date.now();
        const curtime = Math.round(salt / 1000);
        const sign = sha256(appid + this.truncate(q) + salt + curtime + key).toString();

        const params = new URLSearchParams({
            q,
            from: langCode.source,
            to: langCode.target,
            appKey: appid,
            salt: String(salt),
            sign,
            signType: "v3",
            curtime: String(curtime)
        });

        const data = await this.requestJson("https://openapi.youdao.com/api?" + params);
        if (data.errorCode !== "0") this.failWithCode(String(data.errorCode));

        return (data.translation ?? []).join(" ");
    }
}
