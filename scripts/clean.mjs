import { rmSync } from "node:fs";

// tsc 不会清理 outDir，删掉源码后编译产物会一直留在 dist 里，
// 最终被 npm publish 打出去。构建前先清空。
rmSync(new URL("../dist", import.meta.url), { recursive: true, force: true });
