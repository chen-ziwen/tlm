import * as Adapter from "./index.js";
import { configPath } from "../../constants.js";
import { readFile } from "../../util/helpers.js";

const { pl: name } = await readFile(configPath);

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

export default new Translator(name);