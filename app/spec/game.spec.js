const Game = require("../models/game");
const Player = require("../models/player");
const { Deck } = require("../models/collection");
const Card = require("../models/card");

describe("The game", () => {
    describe("when the current player passes", () => {
        let game;
        let player;

        beforeEach(() => {
            const ioSpy = { 
                socketSpy: {
                    emit: function (event, data) { this.emitCalled = true; },
                    emitCalled: false
                },
                to: function (playerId) { 
                    this.toCalled = true; 
                    return this.socketSpy;
                }, 
                toCalled: false ,
            };
            game = new Game(1, ioSpy, new Deck([]), new Deck([]));
            player = new Player(1, "player1");
            game.addPlayer(player);
            game.currentPlayer = player;
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