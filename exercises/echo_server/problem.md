Create a WebSocket server that speaks **echo** protocol i.e. responds with the same message as received.

Your server should listen on the port specified by the first argument to your program.

----------------------------------------------------------------------
## HINTS

It's a continuation of the previous exercise (ACCEPT CONNECTION).
Once you accept a request you get a connection object on which you can listen for a `message` event:

```js
wsServer.on('request', function(req){
    var connection = req.accept('echo', req.origin);
    connection.on('message', function(msg) {
        // handle the message
    });
});
```

The `msg` param in the callback is an object like:
```js
{
   "type" : "utf8",
   "utf8Data" : "message content"
}
```

To send a message to the client just call `connection.send("my message")`.

----------------------------------------------------------------------