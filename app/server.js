require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.setMaxListeners(0)
app.use(express.static('app/static'))

const lobbyController = require('./controllers/lobbyController');
const gameController = require("./controllers/gameController");

lobbyController.initialize(io, gameController.createAndStartGame, gameController.createSinglePlayerGame);

//socket connection handlers
io.on('connection', socket => addSocketListeners(socket));

function addSocketListeners(socket) {
    lobbyController.addSocketListeners(socket);
    gameController.addSocketListeners(socket);
}

const port = process.env.PORT || 8080
http.listen(port, () => {
    console.log("server started on port", port)
})