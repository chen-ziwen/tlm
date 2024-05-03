// 火山翻译
const Core = require('./core');
const { iam } = require("@volcengine/openapi");

class Volcengine extends Core {
    constructor() {
        super("volcengine");
        this.mTitle = "火山翻译";
    }


    async translate() {
        const url = "translate.volcengineapi.com";
    }

}

module.exports = Volcengine;
