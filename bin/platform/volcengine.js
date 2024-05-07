// 火山翻译
const { Service } = require("@volcengine/openapi");

class Volcengine {
    constructor(name) {
        this.mName = name;
        this.mTitle = "火山翻译";
    }

    async translate() {
        const url = "translate.volcengineapi.com";

    }

}

module.exports = Volcengine;
