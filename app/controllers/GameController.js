const { v4: uuidv4 } = require("uuid");
const {Game, SingleMode} = require("../models/game");

const games = {};
const gameController = {};

gameController.createAndStartGame = (io, players) => {
    const game = new Game(generateGameId(), io, players);
    games[game.id] = game;
    game.start();
}

gameController.createSinglePlayerGame = (io, player, numPlayers, difficulty) => {
    const game = new SingleMode(generateGameId(), io, player, numPlayers, difficulty);
    games[game.id] = game;
    game.start();
}

gameController.pass = (info) => {
    const game = games[info.gameId];
    if (game && game.getCurrentPlayer().id === info.playerId)
        game.passCurrentTurn();
}

gameController.playCard = (data) => {
    const game =    games[data.gameId];
    if (game && game.getCurrentPlayer().id === data.playerId && data.card_index >= 0 && game.play(data.card_index, data.suit)) {
        if(game.currentPlayerHasWon()) {
            game.finish();
            removeGame(game);
        }else {
            game.nextTurn();
        }
    }
}

gameController.challenge = (data) => {
    const game = games[data.gameId];
    if (game && game.getCurrentPlayer().id === data.playerId) {
        game.challenge(data.challenge);
        game.nextTurn();
    }
}

gameController.broadcastMessage = (data) => {
    const game = games[data.gameId];
    const message = data.message;
    if (game && message) {
        game.broadcast("message", message);
    }
}

gameController.unoButton = (data) => {
    const game = games[data.gameId];
    let player = game.getPlayer(data.playerId);
    if (game && player){
        game.callUno(player)
    }
}

gameController.purgeGame = (gameid) => {
    let game = games[gameid]
    if(game){
        removeGame(game)
    }    
}

gameController.addSocketListeners = (socket) => {
    socket.on("pass", gameController.pass);
    socket.on("playCard", gameController.playCard);
    socket.on("message", gameController.broadcastMessage);
    socket.on("challenge", gameController.challenge);   
    socket.on("end", gameController.purgeGame);
    socket.on("unoButton", gameController.unoButton);
}

function generateGameId() {
    return uuidv4();
}

function removeGame(game) {
    delete games[game.id];
}

module.exports = gameController;