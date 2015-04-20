var spawn = require("child_process").spawn;
var path = require("path");
var test = require("tape");

var exercises = require("./menu.json");

exercises.forEach(function (name) {

    test(name, function (t) {
        t.plan(2);

        var exerciseDir = name.toLowerCase().replace(" ", "_");
        var solution = path.join(__dirname, exerciseDir, "/solution/solution.js");

        websockito([ "select", name ])
            .on("exit", selected)
            .on("error", fail("cannot select exercise"))
            .stderr.pipe(process.stderr);

        function fail(msg) {
            return function() {
                t.fail(msg);
            };
        }

        function selected (code) {
            t.equal(code, 0, "exercise selected");
            websockito([ "verify", solution ])
                .on("exit", verified)
                .on("error", fail("solution failed"))
                .stderr.pipe(process.stderr);
        }

        function verified (code) {
            t.equal(code, 0, "solution passed");
        }
    });
});

function websockito(args) {
    args.unshift(path.join(__dirname, "../websockito.js"));
    return spawn(process.execPath, args);
}