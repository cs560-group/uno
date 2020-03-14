const { v4: uuidv4 } = require("uuid");
const { Deck } = require("../models/collection");
const Game = require("../models/game");

const games = {};
const gameController = {};

gameController.createAndStartGame = (io, players) => {
    const deck = new Deck([]);
    deck.initDeck();
    const discardPile = new Deck([]);
    const game = new Game(generateGameId(), io, deck, discardPile);
    game.addAllPlayers(players);
    games[game.id] = game;
    game.start();   
}

gameController.pass = (info) => {
    const game = games[info.gameId];
    if (game && game.getCurrentPlayer().id === info.playerId)
        game.passCurrentTurn();
}

gameController.addSocketListeners = (socket) => {
    socket.on("pass", gameController.pass);
}

function generateGameId() {
    return uuidv4();
}

module.exports = gameController;