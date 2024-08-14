import { isExistConfig, readFile, writeFile } from "@util/helpers";
import { MPTLRC, CONFIG_PATH } from "@/constants";

(async () => {
    const config = <Tl.Config>await readFile(CONFIG_PATH);
    const isExist = await isExistConfig(MPTLRC);
    if (!isExist) {
        await writeFile(MPTLRC, config);
    } else {
        const localConfig = await readFile(MPTLRC);
        Object.assign(config, localConfig);
        await writeFile(MPTLRC, config);
    }
})();
