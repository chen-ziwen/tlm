
/**
 * 
 * @param {*} sl 
 * @param {*} tl 
 * @param {*} raw 
 * @returns 
 */

export function translate(sl, tl, raw) {
    return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${raw}`)
        .then(res => res.json())
        .then(res => {
            return res?.[0]?.[0]?.[0] || "";
        });
}