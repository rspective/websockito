Write a server that accepts WebSocket connections on 'echo' protocol from any origin.

The server should listen on the port provided by the first argument to your program.

----------------------------------------------------------------------
## HINTS

There is a variety of WebSocket libraries for node.js. For this exercise you can use a package named simply `websocket`.
To install it type:

```sh
$ npm install websocket
```

It offers both a client and a server. In this case you need to import the server part only:

```js
var WebSocketServer = require('websocket').server;
```

The WebSocketServer's constructor takes a config object which (among many optional settings) has to contain
a required `httpServer`. It is a basic rule that to init a WebSocket connection an HTTP server is needed.

Once you have a running server you can accept or reject incoming connections by listening for a `request` event.
Based on an arbitrary selected protocol name and the request's origin you can decide if you want to handle it.

For example to accept a request from `https://facebook.com` wanting to talk in a `chat` protocol you can do this:

```js
wsServer.on('request', function(req){
    req.accept('chat', 'https://facebook.com');
});
```

That's all you need for this exercise.

----------------------------------------------------------------------