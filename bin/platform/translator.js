const Adapter = require(".");
const config = require("../../config.json");

class Translator {
    constructor(pls) {
        const name = pls.charAt(0).toUpperCase() + pls.slice(1);
        this.adapter = new Adapter[name](pls);
    }

    translate(query) {
        return this.adapter.translate(query);
    }

    switchSource(source) {
        return this.adapter.switchSource(source);
    }

    switchTarget(target) {
        return this.adapter.switchTarget(target);
    }
}

module.exports = new Translator(config.pls);