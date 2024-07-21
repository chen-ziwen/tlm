declare module Tl {

    export interface Methods {
        translate: (query: string[]) => Promise<string | undefined | void>;
    }

    export interface PlatformMsg {
        name: string;
        appid: string;
        key: string;
    }

    export interface Config {
        pl: string;
        source: string;
        target: string;
        platform: { [key: string]: PlatformMsg };
    }

    export interface LangMsg {
        strategy: "exclude" | "include";
        language: string[];
    }

    export interface LangsConfig {
        codeMap: Record<string, string>;
        sourceMap: LangMsg;
        targetMap: { [key: string]: LangMsg };
    }

    export interface DefaultLangs {
        source: string;
        target: string;
    }

    export interface SupportLangs {
        zh: string;
        en: string;
        code: string
    }
}

