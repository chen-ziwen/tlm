import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const CONFIG_PATH = path.join(DIRNAME, '../config.json');
const TLMRC = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.tlmrc.json');


try {
    // 直接读取配置文件内容
    let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

    try {
        // 尝试读取 tlmrc 文件，如果存在则合并配置
        const localConfig = JSON.parse(fs.readFileSync(TLMRC, 'utf8'));
        Object.assign(config, localConfig);
    } catch (err) {
        // 如果 tlmrc 文件不存在，则忽略错误
        console.log('No existing tlmrc file found.');
    }

    // 写入或更新 tlmrc 文件
    fs.writeFileSync(TLMRC, JSON.stringify(config, null, 2), 'utf8');
    console.log('Configuration updated successfully.');
} catch (err) {
    console.error('Error processing configuration:', err);
}
