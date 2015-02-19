#!/usr/bin/env node

"use strict";

var path = require("path");
var workshopper = require("workshopper");

function relative(postfix) {
    return path.join(__dirname, postfix);
}

workshopper({
    name: "websockito",
    title: "WebSockito",
    subtitle: "A module to teach you how to use Web Sockets in Node.js.",
    appDir: __dirname,
    menuItems: [],
    exerciseDir: relative('./exercises/')
});
