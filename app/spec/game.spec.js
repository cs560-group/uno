const Game = require("../models/game");
const Player = require("../models/player");
const { Deck } = require("../models/collection");
const Card = require("../models/card");

describe("The game", () => {
    describe("when the current player passes", () => {
        let game;
        let player;

        beforeEach(() => {
            game = new Game(null, new Deck([]), new Deck([]));
            player = new Player(1, "player1");
            game.addPlayer(player);
            game.currentIndex = 0;
        });

        it("should deal a card to the player", () => {
            game.deck = new Deck([new Card(1, "red")]);
            game.passCurrentTurn();
            expect(player.hand.count()).toBe(1);
        });

        describe("and a non-playable card has been dealt to him", () => {
            it("should end the player's turn", () => {
                game.addPlayer(new Player(2, "player2"));
                game.deck = new Deck([new Card(1, "red")]);
                game.discards = new Deck([new Card(-1, "blue")]);

                game.passCurrentTurn();
                
                expect(player.myTurn).toBeFalsy();
            });
        });

        describe("and a playable card has been dealt to him", () => {
            it("should not end the player's turn", () => {
                game.addPlayer(new Player(2, "player2"));
                game.deck = new Deck([new Card(1, "red")]);
                game.discards = new Deck([new Card(5, "red")]);
                
                game.passCurrentTurn();
                
                expect(player.myTurn).toBeTruthy();
            });
        });
    });
});