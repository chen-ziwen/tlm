import { isExistConfig, readFile, writeFile } from "@util/helpers";
import { MPTLRC, CONFIG_PATH } from "@/constants";

// npm install 或者 npm update 更新配置文件
(async () => {
    if (process.env.SKIP_POSTINSTALL !== "true") {
        const config = await readFile(CONFIG_PATH);
        const isExist = await isExistConfig(MPTLRC);
        if (!isExist) {
            await writeFile(MPTLRC, config);
        } else {
            const localConfig = await readFile(MPTLRC);
            Object.assign(config, localConfig);
            await writeFile(MPTLRC, config);
        }
    }
})();
