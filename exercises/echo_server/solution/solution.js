"use strict";

var http = require('http');
var WebSocketServer = require('websocket').server;

var server = http.createServer(function(request, response){});

server.listen(process.argv[2]);

var wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(req) {
    var connection = req.accept('echo', req.origin);
    connection.on('message', function(message) {
        connection.send(message.utf8Data);
    });
});