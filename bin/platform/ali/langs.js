const langs = {
    codeMapping: {
        auto: "auto",
        zh: "zh",
        cht: "zh-tw",
        en: "en",
        ru: "ru",
        ja: "ja",
        ko: "ko",
        de: "de",
        fr: "fr",
        es: "es",
        it: "it",
        pt: "pt",
        th: "th"
    },
    source: {
        strategy: "exclude",
        language: []
    },
    target: {
        auto: {
            strategy: "exclude",
            language: ["auto"]
        },
        zh: {
            strategy: "exclude",
            language: ["auto"],
        },
        cht: {
            strategy: "include",
            language: ["zh"],
        },
        en: {
            strategy: "exclude",
            language: ["auto"],
        },
        ru: {
            strategy: "exclude",
            language: ["auto"],
        },
        ja: {
            strategy: "exclude",
            language: ["auto"],
        },
        ko: {
            strategy: "exclude",
            language: ["auto"],
        },
        de: {
            strategy: "exclude",
            language: ["auto"],
        },
        fr: {
            strategy: "exclude",
            language: ["auto"],
        },
        es: {
            strategy: "exclude",
            language: ["auto"],
        },
        it: {
            strategy: "exclude",
            language: ["auto"],
        },
        pt: {
            strategy: "exclude",
            language: ["auto"],
        },
        th: {
            strategy: "exclude",
            language: ["auto"],
        }
    }
}

module.exports = langs; 