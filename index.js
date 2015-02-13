#!/usr/bin/env node

"use strict";

var fs = require("fs");
var path = require("path");

var adventure = require("adventure");

var workshopper = module.exports = adventure({
  name: "websockito",
  bg: "blue",
  fg: "white"
});

function onlyJS(fileName) {
    return fileName.match(/^[^.].*\.js$/);
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function prepareTitle(fileName) {
    var title = fileName.replace(/\.js$/gi, "");

    return title.split("-").map(capitalize).join(' ');
}

function addAssignment(workshop, fileName) {
    workshop.add(prepareTitle(fileName), function () {
        return require("./assignments/" + fileName);
    });
}

var problems = fs.readdirSync(path.resolve(__dirname, "assignments"));

problems.filter(onlyJS).forEach(addAssignment.bind(null, workshopper));

if (require.main === module) {
    workshopper.execute(process.argv.slice(2));
}
