import fs from "fs";

function readJson<T>(file: string): T | undefined {
    if (!fs.existsSync(file)) return undefined;
    try {
        return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
    } catch {
        return undefined;
    }
}

function writeJson(file: string, data: unknown): void {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function exist(file: string): boolean {
    return fs.existsSync(file);
}

export {
    readJson,
    writeJson,
    exist
};
