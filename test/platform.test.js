import assert from "node:assert/strict";
import test from "node:test";
import { LANGUAGE_MAP } from "../dist/constants.js";
import {
    PLATFORM_KEYS,
    createAdapter,
    findPlatform,
    isLanguageSupported,
    matchPlatformLanguageCode,
    platformLangs,
    platformName,
    platformShortName
} from "../dist/platform/index.js";

test("注册表包含全部平台且顺序稳定", () => {
    assert.deepEqual(PLATFORM_KEYS, ["youdao", "baidu", "tencent", "ali", "volcengine", "google"]);
});

test("每个平台的语种表都覆盖 LANGUAGE_MAP 里的全部语种", () => {
    for (const key of PLATFORM_KEYS) {
        const { codeMap } = platformLangs(key);
        for (const { code } of LANGUAGE_MAP) {
            assert.ok(code in codeMap, `${key} 的语种表缺少 ${code}`);
        }
    }
});

test("平台名解析忽略大小写", () => {
    assert.equal(findPlatform("Youdao"), "youdao");
    assert.equal(findPlatform("GOOGLE"), "google");
    assert.equal(findPlatform("ali"), "ali");
    assert.equal(findPlatform("notexist"), undefined);
    assert.equal(findPlatform(""), undefined);
});

test("显示名与短名", () => {
    assert.equal(platformName("youdao"), "有道-youdao");
    assert.equal(platformShortName("youdao"), "有道");
    assert.equal(platformName("unknown"), "unknown");
});

test("未知平台取语种表时报错", () => {
    assert.throws(() => platformLangs("nope"), /缺少/);
});

test("语种代码按各平台自己的映射转换", () => {
    assert.deepEqual(
        matchPlatformLanguageCode("google", { source: "zh", target: "cht" }),
        { source: "zh-CN", target: "zh-TW" }
    );
    assert.deepEqual(
        matchPlatformLanguageCode("youdao", { source: "zh", target: "cht" }),
        { source: "zh-CHS", target: "zh-CHT" }
    );
    assert.deepEqual(
        matchPlatformLanguageCode("baidu", { source: "ja", target: "ko" }),
        { source: "jp", target: "kor" }
    );
});

test("火山翻译的 auto 映射为空字符串，不能被误判为不支持", () => {
    assert.deepEqual(
        matchPlatformLanguageCode("volcengine", { source: "auto", target: "zh" }),
        { source: "", target: "zh" }
    );
});

test("语种不在平台 codeMap 里时抛错", () => {
    assert.throws(
        () => matchPlatformLanguageCode("google", { source: "xx", target: "zh" }),
        /不支持当前语种组合/
    );
});

test("isLanguageSupported 同时支持 exclude 与 include 两种策略", () => {
    assert.equal(isLanguageSupported({ strategy: "exclude", language: ["auto"] }, "zh"), true);
    assert.equal(isLanguageSupported({ strategy: "exclude", language: ["auto"] }, "auto"), false);
    assert.equal(isLanguageSupported({ strategy: "include", language: ["zh", "en"] }, "zh"), true);
    assert.equal(isLanguageSupported({ strategy: "include", language: ["zh", "en"] }, "ja"), false);
});

test("每家平台的适配器都能加载并实例化（依赖完整性回归测试）", async () => {
    for (const key of PLATFORM_KEYS) {
        const adapter = await createAdapter(key);
        assert.equal(typeof adapter.translate, "function", `${key} 适配器缺少 translate`);
    }
});

test("createAdapter 对未知平台给出可读错误", async () => {
    await assert.rejects(() => createAdapter("nope"), /不支持/);
});

test("阿里云 SDK 的接口形状符合适配器预期（依赖版本漂移回归测试）", async () => {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);

    const alimt = require("@alicloud/alimt20181012");
    const { $OpenApiUtil } = require("@alicloud/openapi-core");

    // 1.3 时代这两个包分别叫 openapi-client / 另一套返回结构，1.4 起换成了 openapi-core
    assert.equal(typeof alimt.default, "function", "alimt 的默认导出应为客户端类");
    assert.equal(typeof alimt.TranslateGeneralRequest, "function");
    assert.equal(typeof $OpenApiUtil.Config, "function");

    const config = new $OpenApiUtil.Config({ accessKeyId: "x", accessKeySecret: "y", regionId: "cn-hangzhou" });
    config.endpoint = "mt.aliyuncs.com";
    const client = new alimt.default(config);

    assert.equal(typeof client.translateGeneral, "function");
});
