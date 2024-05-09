// 火山翻译
// 没有提供nodejs的翻译相关的sdk调用方式，只能走api请求。
const { Service } = require("@volcengine/openapi");

class Volcengine {
    constructor(name) {
        this.mName = name;
        this.mTitle = "火山翻译";
    }

    async translate() {
        const url = "translate.volcengineapi.com";
        const myHeader = new Headers();
        

        return fetch(url, {
            headers: {
                Authorization: ""
            },
            body: {
                Action: "",
                // Version:
            }
        })
    }

}

module.exports = Volcengine;
