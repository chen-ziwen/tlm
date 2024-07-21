import * as Adapters from "./index.js";
import { configPath } from "../../constants.js";
import { readFile } from "../../util/helpers.js";
const { pl: name } = await readFile(configPath);
class Translator {
    constructor(pl) {
        this.pl = pl;
        const name = this.pl.charAt(0).toUpperCase() + this.pl.slice(1);
        this.adapter = new Adapters[name](this.pl);
    }
    translate(query) {
        return this.adapter.translate(query);
    }
}
export default new Translator(name);
