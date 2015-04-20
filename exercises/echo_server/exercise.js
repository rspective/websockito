var exercise = require("workshopper-exercise")();
var filecheck = require("workshopper-exercise/filecheck");
var execute = require("workshopper-exercise/execute");
var WebSocketClient = require("websocket").client;
var _ = require("lodash");
var rndport = require("../../lib/rndport.js");

// checks that the submission file actually exists
exercise = filecheck(exercise);

// execute the solution and submission in parallel with spawn()
exercise = execute(exercise);

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

function rndelem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function query(mode, callback) {
    var exercise = this;
    var connected = false;
    var passed = false;

    var fail = function (msg) {
        if (msg) {
            exercise.emit("fail", msg);
        }
        callback(null, false);
    };
    var pass = function () {
        passed = true;
        callback(null, true);
    };

    var url = "ws://localhost:" + exercise.submissionPort;

    var wsClient = new WebSocketClient()
        .on("connectFailed", function (err) {
            fail("Error connecting to " + url + " - " + err.code);
        })
        .on("connect", function (connection) {
            exercise.emit("pass", "WebSocket connection accepted.");
            connected = true;

            var receivedMessages = [];
            var sentMessages = [];

            connection.on("message", function (msg) {
                receivedMessages.push(msg.utf8Data);

                if (receivedMessages.length > sentMessages.length) {
                    fail("Received more messages than sent.");
                }
                if (receivedMessages.length === sentMessages.length) {
                    var diff = _.difference(sentMessages, receivedMessages);

                    if (diff.length > 0) {
                        fail("Expected messages: (" + sentMessages.join(", ") + "), " +
                             "but received: (" + receivedMessages.join(", ") + ").");
                    } else {
                        exercise.emit("pass", "Received the same messages as sent.");
                        pass();
                    }
                }
            });

            for (var i = 0; i < 3; i++) {
                var message = rndelem(["Hello", "Hi", "Aloha", "Salut", "Ahoj"]);
                sentMessages.push(message);
                connection.send(message);
            }

            setTimeout(function () {
                if (!passed) {
                    fail("Timeout. Didn't receive sent messages.");
                }
            }, 1000);
        })
        .connect(url, "echo");

    setTimeout(function () {
        if (!connected) {
            fail("Timeout. Connection not accepted.");
        }
    }, 1000);
}

module.exports = exercise;