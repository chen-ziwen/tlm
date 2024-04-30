// 火山翻译
const { getPlatformItem } = require("../../util/helpers");
const Driver = require('./driver');
const { iam } = require("@volcengine/openapi");

class Volcengine extends Driver {
    constructor() {
        super();

        this.host = "translate.volcengineapi.com";
        this.main();
    }


    async main() {
        const iamService = iam.defaultService;

        // 设置sdk
        const { appid, key } = getPlatformItem("volcengine");
        iamService.setAccessKeyId(appid);
        iamService.setSecretKey(key);

        console.log('user response ====>', iamService);

        const openApiRequestData = {
            method: "POST",
            region: "cn-north-1",
            params: {
                Action:""
            }
        }
        iamService.fetchOpenAPI()


    }
}

module.exports = Volcengine;
