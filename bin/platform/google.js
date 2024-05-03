// 谷歌翻译
const Core = require("./core");
// export function translate(sl, tl, raw) {
//     return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${raw}`)
//         .then(res => res.json())
//         .then(res => {
//             return res?.[0]?.[0]?.[0] || "";
//         });
// }

class Google extends Core {
    constructor() {
        super("google");
        this.mTitle = "谷歌翻译";

    }

    async translate() {
        const url = "https://translate.googleapis.com/translate_a/single";
    }
}

module.exports = Google;