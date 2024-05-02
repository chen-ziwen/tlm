const { readFile } = require("../../util/helpers");
const { configPath } = require("../../constants");

class Core {
    constructor(name) {
        this.mName = name;
        this.mTitle = "";
    }

    async getPlatformConfig() {
        const config = await readFile(configPath);
        const platform = config.platform[this.mName];
        const to = config.to, from = config.from, pls = config.pls;
        return { ...platform, to, from, pls }
    }

    async getPlatformLangList() {

    }


}

module.exports = Core;