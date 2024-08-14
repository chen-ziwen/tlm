import { isExistConfig, readFile, writeFile } from "@util/helpers";
import { TLMRC, CONFIG_PATH } from "@/constants";

(async () => {
    const config = <Tl.Config>await readFile(CONFIG_PATH);
    const isExist = await isExistConfig(TLMRC);
    if (!isExist) {
        await writeFile(TLMRC, config);
    } else {
        const localConfig = await readFile(TLMRC);
        Object.assign(config, localConfig);
        await writeFile(TLMRC, config);
    }
})();
