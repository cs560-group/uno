const Player = require('../models/player');

let queue = []
let num_players = 2;

const lobbyController = {};

lobbyController.initialize = (io, createAndStartGame) => {
    lobbyController.io = io;
    lobbyController.createAndStartGame = createAndStartGame;
}

/**
 * Adds new player connections to the queue
 * If the queue surpasses num_players it creates a game, removes that number of players from the queue and adds them to the game.
 */
lobbyController.handleConnection = (io, socket, name, createAndStartGame) => {
    const newPlayer = new Player(socket.id, name);
    socket.emit("playerId", socket.id);
    queue.push(newPlayer)
    lobbyController.sendLobbyUpdate(io);

    if(lobbyHasEnoughForGame()) {
        createAndStartGame(io, dequeue(num_players));
    }
}

lobbyController.sendLobbyUpdate = (io) => {
    const lobbyState = queue.map(player => player.name);
    queue.forEach(player => io.to(player.id).emit("lobbyUpdate", lobbyState));
}

lobbyController.addSocketListeners = (socket) => {
    socket.on('newplayer', name => lobbyController.handleConnection(lobbyController.io, socket, name, lobbyController.createAndStartGame));
}

function lobbyHasEnoughForGame() {
    return queue.length >= num_players;
}

function dequeue(count) {
    return queue.splice(0, count);
}

module.exports = lobbyController