const { readFile } = require("../../util/helpers");
const { configPath } = require("../../constants");
const { v4: uuidv4 } = require("uuid");

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

    getTruncate(str) {
        const len = str.length;
        if (len <= 20) return str;
        return str.slice(0, 10) + len + str.slice(-10);
    }

    generalUuidv4() {
        return uuidv4();
    }
}

module.exports = Core;