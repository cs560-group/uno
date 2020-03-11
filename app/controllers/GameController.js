const Player = require('../models/player')
const Game = require('../models/game')

let queue = []
let games = {}
let num_players = 1;

const gameController = {}

/**
 * Adds new player connections to the queue
 * If the queue surpasses num_players it creates a game, removes that number of players from the queue and adds them to the game.
 * The game is also added to the games object with its id as the key.
 */
gameController.handleConnection = (io, socket, name) => {
    const newPlayer = new Player(socket.id, name);
    socket.emit("playerId", socket.id);
    queue.push(newPlayer)
    gameController.sendLobbyUpdate(io);

    if(queue.length >= num_players){
        const game = new Game(io)
        game.genID()

        while(games[game.id]){
            game.genID()
        }

        let players = queue.slice(0, num_players)
        queue = queue.slice(num_players)

        for(player of players){
            game.addPlayer(player);
        }

        game.start()        
    }
}

gameController.sendLobbyUpdate = (io) => {
    const lobbyState = queue.map(player => player.name);
    queue.forEach(player => io.to(player.id).emit("lobbyUpdate", lobbyState));
}

module.exports = gameController