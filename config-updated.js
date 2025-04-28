import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const CONFIG_PATH = path.join(DIRNAME, './config.json');
const TLMRC = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], '.tlmrc.json');

try {
    let config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    try {
        const localConfig = JSON.parse(fs.readFileSync(TLMRC, 'utf8'));
        Object.assign(config, localConfig);
    } catch (err) {
        console.log('No existing tlmrc file found.');
    }
    fs.writeFileSync(TLMRC, JSON.stringify(config, null, 2), 'utf8');
    console.log('Configuration updated successfully.');
} catch (err) {
    console.error('Error processing configuration:', err);
}
