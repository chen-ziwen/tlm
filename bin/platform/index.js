const Baidu = require("./baidu");
const Google = require("./google");
const Youdao = require("./youdao");
const Volcengine = require("./volcengine");

const config = require("../../config.json");

const platform = {
    baidu: new Baidu(),
    google: new Google(),
    youdao: new Youdao(),
    volcengine: new Volcengine()
};

const platformName = config.pls;

function translate(query) {
    return platform[platformName].translate(query);
}

module.exports = {
    translate,
}