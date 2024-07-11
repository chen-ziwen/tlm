const langs = {
    codeMap: {
        auto: "auto",
        zh: "zh",
        cht: "zh-TW",
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
    sourceMap: {
        strategy: "exclude",
        language: []
    },
    targetMap: {
        auto: {
            strategy: "exclude",
            language: ["auto"]
        },
        zh: {
            strategy: "exclude",
            language: ["auto"],
        },
        cht: {
            strategy: "exclude",
            language: ["auto"],
        },
        en: {
            strategy: "exclude",
            language: ["auto"]
        },
        ru: {
            strategy: "include",
            language: ["ru", "zh", "cht", "en", "fr", "es", "it", "de", "pt"]
        },
        ja: {
            strategy: "include",
            language: ["ja", "zh", "cht", "en", "ko"]
        },
        ko: {
            strategy: "include",
            language: ["ko", "zh", "cht", "en", "ja"]
        },
        de: {
            strategy: "include",
            language: ["de", "zh", "cht", "en", "fr", "es", "it", "ru", "pt"]
        },
        fr: {
            strategy: "include",
            language: ["fr", "zh", "cht", "en", "es", "it", "de", "ru", "pt"]
        },
        es: {
            strategy: "include",
            language: ["es", "zh", "cht", "en", "fr", "it", "de", "ru", "pt"]
        },
        it: {
            strategy: "include",
            language: ["it", "zh", "cht", "en", "fr", "es", "de", "ru", "pt"]
        },
        pt: {
            strategy: "include",
            language: ["pt", "zh", "cht", "en", "fr", "es", "it", "de", "ru"]
        },
        th: {
            strategy: "include",
            language: ["th", "zh", "cht", "en"]
        }
    }
}

export default langs; 