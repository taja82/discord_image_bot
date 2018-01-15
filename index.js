var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();

client.connect({ token: "NDAyMzUxMDYyNTQ5NTI4NTc3.DT3rTA.XrxprKRpJ8W221oTLBqjrcQy9Gc" });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
if (e.message.content == "ping")
e.message.channel.sendMessage("pong");
});