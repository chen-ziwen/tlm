import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("../dist/cli.js", import.meta.url));

function makeHome() {
    return fs.mkdtempSync(path.join(os.tmpdir(), "tlm-test-"));
}

/** 在隔离的 HOME 下运行 CLI，避免读到开发机真实的 ~/.tlmrc.json */
function run(args, home) {
    const result = spawnSync(process.execPath, [CLI, ...args], {
        env: { ...process.env, USERPROFILE: home, HOME: home },
        encoding: "utf-8"
    });
    const stdout = result.stdout ?? "";
    const stderr = result.stderr ?? "";
    return { status: result.status, stdout, stderr, output: stdout + stderr };
}

function rcPath(home) {
    return path.join(home, ".tlmrc.json");
}

function readRc(home) {
    return JSON.parse(fs.readFileSync(rcPath(home), "utf-8"));
}

function writeRc(home, config) {
    fs.writeFileSync(rcPath(home), JSON.stringify(config, null, 2));
}

test("全新环境（无配置文件）也能正常使用", () => {
    const home = makeHome();

    const version = run(["-v"], home);
    assert.equal(version.status, 0);
    assert.match(version.stdout, /\d+\.\d+\.\d+/);

    const list = run(["ls"], home);
    assert.equal(list.status, 0);
    for (const name of ["有道", "百度", "腾讯云", "阿里云", "火山", "谷歌"]) {
        assert.match(list.output, new RegExp(name));
    }

    assert.equal(run(["ls", "langs"], home).status, 0);
});

test("未配置密钥时翻译给出可照抄的命令，而不是崩栈", () => {
    const home = makeHome();
    const result = run(["p", "hello"], home);

    assert.notEqual(result.status, 0);
    assert.match(result.output, /尚未配置应用ID和密钥/);
    assert.match(result.output, /tlm set-trl/);
    assert.doesNotMatch(result.output, /Cannot read properties/);
});

test("失败路径必须是非 0 退出码", () => {
    const home = makeHome();

    assert.notEqual(run(["use", "notexist"], home).status, 0);
    assert.notEqual(run(["set-langs"], home).status, 0);
    assert.notEqual(run(["set-langs", "-s", "xx"], home).status, 0);
    assert.notEqual(run(["get-trl", "notexist"], home).status, 0);
});

test("成功路径是 0 退出码", () => {
    const home = makeHome();

    assert.equal(run(["use", "youdao"], home).status, 0);
    assert.equal(run(["set-langs", "-s", "en"], home).status, 0);
    assert.equal(run(["get-trl"], home).status, 0);
});

test("平台名大小写不敏感，且按标准名落盘", () => {
    const home = makeHome();

    assert.equal(run(["use", "Youdao"], home).status, 0);
    assert.equal(readRc(home).pl, "youdao");

    assert.equal(run(["use", "GOOGLE"], home).status, 0);
    assert.equal(readRc(home).pl, "google");
});

test("凭据写入与读取（默认打码，-s 显示明文）", () => {
    const home = makeHome();

    assert.equal(run(["set-trl", "baidu", "-a", "APPID123", "-s", "SECRETKEY"], home).status, 0);
    assert.deepEqual(readRc(home).platform.baidu, { appid: "APPID123", key: "SECRETKEY" });

    const masked = run(["get-trl", "baidu"], home);
    assert.match(masked.output, /APPID123/);
    assert.match(masked.output, /\*{9}/);
    assert.doesNotMatch(masked.output, /SECRETKEY/);

    assert.match(run(["get-trl", "baidu", "-s"], home).output, /SECRETKEY/);
});

test("读到的配置会被归一化：丢掉残留字段、补齐全部平台", () => {
    const home = makeHome();
    writeRc(home, {
        pl: "baidu",
        source: "auto",
        target: "zh",
        platform: {
            baidu: { name: "百度-baidu", appid: "A", key: "B" },
            youdao: { name: "有道-youdao", appid: "", key: "" }
        }
    });

    assert.equal(run(["use", "baidu"], home).status, 0);
    const config = readRc(home);

    assert.equal(Object.keys(config.platform).length, 6);
    assert.deepEqual(config.platform.baidu, { appid: "A", key: "B" });
    for (const platform of Object.values(config.platform)) {
        assert.equal("name" in platform, false);
    }
});

test("配置文件损坏时回退默认配置，不崩", () => {
    const home = makeHome();
    fs.writeFileSync(rcPath(home), "{ 这不是合法 json");

    const result = run(["ls"], home);
    assert.equal(result.status, 0);
    assert.match(result.output, /有道/);
    assert.doesNotMatch(result.output, /at Object\./);
});

test("手改配置把 pl 写坏时，给提示并回退，不泄漏内部错误", () => {
    const home = makeHome();
    run(["use", "youdao"], home);
    const config = readRc(home);
    config.pl = "xyz";
    writeRc(home, config);

    const result = run(["get-trl"], home);
    assert.match(result.output, /配置中的平台 `xyz` 不受支持/);
    assert.doesNotMatch(result.output, /Cannot read properties/);
    assert.match(result.output, /有道翻译/);
});

test("语种合法但平台不支持时自动替换为默认语种，且不算失败", () => {
    const home = makeHome();

    assert.equal(run(["use", "tencent"], home).status, 0);
    assert.equal(run(["set-langs", "-s", "ru"], home).status, 0);
    assert.equal(run(["set-langs", "-t", "th"], home).status, 0);

    const config = readRc(home);
    assert.equal(config.source, "ru");
    assert.equal(config.target, "zh");
});

test("语种写入后进程内可见（同一命令内读写一致）", () => {
    const home = makeHome();

    assert.equal(run(["set-langs", "-s", "en", "-t", "ja"], home).status, 0);
    const config = readRc(home);
    assert.equal(config.source, "en");
    assert.equal(config.target, "ja");
});
