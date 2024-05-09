const adapter = require(".");
const config = require("../../config.json");

class Translator {
    constructor(pls) {
        const name = pls.charAt(0).toUpperCase() + pls.slice(1);
        this.adapter = new adapter[name](pls);
    }

    translate(query) {
        return this.adapter.translate(query);
    }

}

module.exports = new Translator(config.pls);