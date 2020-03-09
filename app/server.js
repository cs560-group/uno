const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const {Game} = require("./models/game.js")
const {Player} = require("./models/player.js");

const players = new Array();

io.on('connection', function(socket) {
  console.log('a user connected');
  players.push(new Player());
  io.emit("players", players.length);
  socket.on("disconnect", () => console.log("a user disconnected"));
  console.log(players.length);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});