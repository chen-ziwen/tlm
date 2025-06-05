declare namespace TLM {
  interface Methods {
    translate: (query: string[]) => Promise<string | undefined | void>;
  }

  interface PlatformMsg {
    name: string;
    appid: string;
    key: string;
  }

  interface Config {
    pl: string;
    source: string;
    target: string;
    platform: Record<string, PlatformMsg>;
  }

  interface LangMsg {
    strategy: "exclude" | "include";
    language: string[];
  }

  interface LangsConfig {
    codeMap: Record<string, string>;
    sourceMap: LangMsg;
    targetMap: Record<string, LangMsg>;
  }

  interface DefaultLangs {
    source: string;
    target: string;
  }

  interface SupportLangs {
    zh: string;
    en: string;
    code: string;
  }
}
