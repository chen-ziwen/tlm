const driver = require(".");
const config = require("../../config.json");

function translate(query) {
    const name = config.pls;
    const pl = name.charAt(0).toUpperCase() + name.slice(1);
    return (new driver[pl](name)).translate(query);
}

module.exports = {
    translate
}