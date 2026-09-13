import MD5 from "crypto-js/md5.js";
import { BasePlatform } from "@/platform/base";

export default class Baidu extends BasePlatform {
    protected readonly title = "百度翻译";
    protected readonly errorDoc = "https://api.fanyi.baidu.com/doc/21";
    protected readonly errorMessages: Record<string, string> = {
        "54000": "缺少必填的参数",
        "58001": "不支持的语言类型",
        "54005": "翻译文本过长",
        "52003": "应用ID无效",
        "58002": "无相关服务的有效实例",
        "90107": "开发者账号无效",
        "54001": "签名检验失败，检查KEY和SECRET",
        "54004": "账户已经欠费",
        "54003": "访问频率受限",
    };

    async translate(query: string[]): Promise<string> {
        const { appid, key } = this.credentials();
        const { langCode } = this.context();
        const q = query.join(" ");
        const salt = Date.now();
        const sign = MD5(appid + q + salt + key).toString();

        const params = new URLSearchParams({
            q,
            from: langCode.source,
            to: langCode.target,
            appid,
            salt: String(salt),
            sign
        });

        const data = await this.requestJson("https://fanyi-api.baidu.com/api/trans/vip/translate?" + params);
        if (data.error_code) this.failWithCode(String(data.error_code));

        return data.trans_result?.[0]?.dst ?? "";
    }
}
