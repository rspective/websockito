var exercise = require("workshopper-exercise")();
var filecheck = require("workshopper-exercise/filecheck");
var execute = require("workshopper-exercise/execute");
var WebSocketClient = require("websocket").client;

// checks that the submission file actually exists
exercise = filecheck(exercise);

// execute the solution and submission in parallel with spawn()
exercise = execute(exercise);

function rndport() {
    return 1024 + Math.floor(Math.random() * 64511);
}

// set up the data file to be passed to the submission
exercise.addSetup(function (mode, callback) {
    this.submissionPort = rndport();
    this.submissionArgs = [this.submissionPort];
    process.nextTick(callback);
});

exercise.addProcessor(function (mode, callback) {
    // delayed for 500ms to wait for WS server to start so we can start playing with it
    setTimeout(query.bind(this, mode, callback), 500);
});


function query(mode, callback) {
    var exercise = this;

    function verify(port) {
        var url = "ws://localhost:" + port;

        var wsClient = new WebSocketClient()
            .on("connectFailed", function (err) {
                exercise.emit("fail", "Error connecting to " + url + " - " + err.code);
                callback(null, false); // false = FAIL
            })
            .on("connect", function (connection) {
                exercise.emit("pass", "WebSocket connection accepted.");
                callback(null, true); // true = PASS
            })
            .connect(url, "echo");
    }

    verify(this.submissionPort);
}

module.exports = exercise;