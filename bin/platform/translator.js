const Adapter = require(".");
const config = require("../../config.json");

class Translator {
    constructor(pl) {
        this.pl = pl;
        const name = pl.charAt(0).toUpperCase() + pl.slice(1);
        this.adapter = new Adapter[name](pl);
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

module.exports = new Translator(config.pl);