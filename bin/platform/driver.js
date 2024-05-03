const driver = require("./index");
const config = require("../../config.json");

function translate(query) {
    return (new driver[config.pls]()).translate(query);
}

module.exports = {
    translate
}