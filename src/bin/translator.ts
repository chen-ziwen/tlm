import * as Adapters from ".";
import { TLMRC } from "@/constants";
import { readFile } from "@util/helpers";

const { pl: name } = <Tl.Config>await readFile(TLMRC);

type keys = keyof typeof Adapters;

type Adapters = {
    [key in keys]: new (pl: string) => Tl.Methods;
}

class Translator {
    private pl: string;
    protected adapter: Tl.Methods;
    constructor(pl: string) {
        this.pl = pl;
        const name = this.pl.charAt(0).toUpperCase() + this.pl.slice(1) as keys;
        this.adapter = new (<Adapters>Adapters)[name](this.pl);
    }

    translate(query: string[]) {
        return this.adapter.translate(query);
    }
}

export default new Translator(name);