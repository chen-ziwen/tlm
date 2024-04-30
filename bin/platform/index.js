const Baidu = require("./baidu");
const Google = require("./google");
const Youdao = require("./youdao");
const Volcengine = require("./volcengine");

const { getPlatformItem } = require("../../util/helpers");

const platform = { Baidu, Google, Youdao, Volcengine };

module.exports = (query, config) => {
    const { pls } = config;
    const s = pls.charAt(0).toUpperCase() + pls.slice(1);
    const pl = new platform[s](query, config);
    return pl.translate;
}