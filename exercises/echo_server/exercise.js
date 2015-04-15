var exercise = require('workshopper-exercise')();
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');
var WebSocketClient = require('websocket').client;

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

function rndelem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function query(mode, callback) {
    var exercise = this;
    var fail = function (msg) {
        if (msg)
            exercise.emit('fail', msg);
        callback(null, false)
    };
    var pass = function () {
        callback(null, true)
    };
    var connected = false;

    var url = 'ws://localhost:' + exercise.submissionPort;

    var wsClient = new WebSocketClient()
        .on('connectFailed', function (err) {
            fail('Error connecting to ' + url + ' - ' + err.code);
        })
        .on('connect', function (connection) {
            exercise.emit('pass', 'WebSocket connection accepted.');
            connected = true;

            var receivedMessages = [];
            var sentMessages = [];

            connection.on('message', function (msg) {
                receivedMessages.push(msg.utf8Data);

                if (receivedMessages.length > sentMessages.length) {
                    fail('Received more messages than sent.');
                }
                if (receivedMessages.length === sentMessages.length) {

                    for (var i = 0; i < receivedMessages.length; i++) {
                        if (receivedMessages[i] !== sentMessages[i]) {
                            return fail('Received different message than sent ("'
                                         + receivedMessages[i] + '" instead of "' + sentMessages[i] + '").');
                        }
                    }
                    exercise.emit('pass', 'Received the same messages as sent.');
                    pass();
                }
            });

            for (var i = 0; i < 3; i++) {
                var message = rndelem(['Hello', 'Hi', 'Aloha', 'Salut', 'Ahoj']);
                sentMessages.push(message);
                connection.send(message);
            }

            setTimeout(function () {
                fail("Timeout. Didn't receive sent messages.");
            }, 1000);
        })
        .connect(url, 'echo');

    setTimeout(function () {
        if (!connected) {
            fail('Timeout. Connection not accepted.');
        }
    }, 1000);
}

module.exports = exercise;