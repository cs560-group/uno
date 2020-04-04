const { v4: uuidv4 } = require("uuid");
const { Deck } = require("../models/collection");
const Game = require("../models/game");
const Card = require("../models/card");

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

gameController.playCard = (data) => {
    const game = games[data.gameId];
    const card = new Card(data.card.value, data.card.suit);
    card.type = data.card.type;
    card.isWild = data.card.isWild;
    if (game && game.getCurrentPlayer().id === data.playerId && data.card && game.play(card)) {
        if(game.currentPlayerHasWon()) {
            game.finish();
            removeGame(game);
        }
        else {
            game.nextTurn();
        }
    }
}

gameController.broadcastMessage = (data) => {
    const game = games[data.gameIdf];
    const message = data.message;
    if (game && message) {
        game.broadcast("message", message);
    }
}

gameController.addSocketListeners = (socket) => {
    socket.on("pass", gameController.pass);
    socket.on("playCard", gameController.playCard);
    socket.on("message", gameController.broadcastMessage);
}

function generateGameId() {
    return uuidv4();
}

function removeGame(game) {
    delete games[game.id];
}

module.exports = gameController;