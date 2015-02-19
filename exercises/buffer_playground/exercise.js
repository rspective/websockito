"use strict";

var exercise = require("workshopper-exercise")();
var filecheck = require("workshopper-exercise/filecheck");
var execute = require("workshopper-exercise/execute");
var comparestdout = require("workshopper-exercise/comparestdout");

exercise.longCompareOutput = true;

exercise = filecheck(exercise);
exercise = execute(exercise);

exercise.addSetup(function (mode, callback) {
    process.nextTick(callback);
});

exercise.addProcessor(function (mode, callback) {
    this.submissionStdout.pipe(process.stdout);

    process.nextTick(function () {
        callback(null, true)
    });
});

exercise = comparestdout(exercise);

module.exports = exercise;
