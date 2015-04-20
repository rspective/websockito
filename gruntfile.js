"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: {
                src: ["Gruntfile.js", "exercises/**/*.js"],
                options: {
                    jshintrc: true
                }
            }
        },
        execute: {
            test: {
                src: ["exercises/test.js"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.loadNpmTasks("grunt-execute");

    grunt.registerTask("test", ["execute:test"]);

    grunt.registerTask("default", ["jshint", "test"]);
};