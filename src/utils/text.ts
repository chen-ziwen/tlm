import stringWidth from "string-width";
import { LANGUAGE_MAP } from "@/constants";

function stringFill(len: number, text: string): string {
    return text.padEnd(len - stringWidth(text) + text.length);
}

function foundZhMap(code: string): string {
    return LANGUAGE_MAP.find(item => item.code == code)?.zh ?? code;
}

function isLowerCaseEqual(s1?: string, s2?: string): boolean {
    if (!s1 || !s2) return false;
    return s1.toLowerCase() === s2.toLowerCase();
}

export {
    stringFill,
    foundZhMap,
    isLowerCaseEqual
};
