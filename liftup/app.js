var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 9000 });

wss.on("connection", function (socket) {
    console.log("new client connection");

    socket.on("message", function (d) {
        // var data = JSON.parse(d);
        console.log("Data = " + d);
        wss.broadcast(d);
    });

    socket.once("close", function () {
        console.log("Connection closed");
        wss.broadcast("student disconnected");
    })

    socket.once("error", function (e) {
        console.log(e);
    })
})

wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
        console.log(msg);
    });
    console.log("============== ");
};