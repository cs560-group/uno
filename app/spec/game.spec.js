const Game = require("../models/game");
const Player = require("../models/player");
const { Deck } = require("../models/collection");
const Card = require("../models/card");
const IoSpy = require("./helpers/ioSpy");
const SocketSpy = require("./helpers/socketSpy");

describe("The game", () => {
    describe("when a player starts their turn", () => {
        let ioSpy;
        let game;
        let nextPlayer;

        beforeEach(() => {
            ioSpy = new IoSpy(new SocketSpy());
            game = new Game(1, ioSpy, new Deck([]), new Deck([]));
            const previousPlayer = new Player(1, "player1");
            game.addPlayer(previousPlayer);
            game.currentPlayer = previousPlayer;
            nextPlayer = new Player(2, "player2");
            game.addPlayer(nextPlayer);
            game.createRing();
        })
        it("should draw a card for them", () => {
            const cardToDraw = new Card(1, "blue");
            game.deck = new Deck([cardToDraw]);

            game.nextTurn();

            expect(nextPlayer.hand.count()).toEqual(1);
            expect(nextPlayer.hand.getTopCard()).toEqual(cardToDraw);
            expect(game.deck.count()).toEqual(0);
        });

        it("should update the player's state", () => {
            game.nextTurn();

            expect(ioSpy.socketSpy.lastInvocation().event).toEqual("update");
        });
    });

    describe("when the current player passes", () => {
        let game;
        let player;
        beforeEach(() => {
            game = new Game(1, new IoSpy(new SocketSpy()), new Deck([]), new Deck([]));
            player = new Player(1, "player1");
            game.addPlayer(player);
            game.currentPlayer = player;
            game.currentPlayer.myTurn = true;
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
            beforeEach(() => {
                game.addPlayer(new Player(2, "player2"));
                game.deck = new Deck([new Card(1, "red")]);
                game.discards = new Deck([new Card(5, "red")]);
            });

            it("should not end the player's turn", () => {
                game.passCurrentTurn();
                
                expect(player.myTurn).toBeTruthy();
            });

            describe("and the player passes again", () => {
                it("should do nothing", () => {
                    expect(game.passCurrentTurn()).toEqual(false);
                });
            });
        });
    });
});