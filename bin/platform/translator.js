
import Adapter from "./index.js";
import config from "../../config.json" assert { type: "json"};

class Translator {
    constructor(pl) {
        this.pl = pl;
        const name = pl.charAt(0).toUpperCase() + pl.slice(1);
        this.adapter = new Adapter[name](pl);
    }

    translate(query) {
        return this.adapter.translate(query);
    }
}

export default new Translator(config.pl);