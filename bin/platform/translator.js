const Adapter = require(".");
const config = require("../../config.json");

class Translator {
    constructor(pl) {
        const name = pl.charAt(0).toUpperCase() + pl.slice(1);
        this.adapter = new Adapter[name](pl);
        this.init();
    }

    init() {
        this.translate = this.translate.bind(this);
        this.switchSource = this.switchSource.bind(this);
        this.switchTarget = this.switchTarget.bind(this);
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