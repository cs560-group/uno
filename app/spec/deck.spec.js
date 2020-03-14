const Card = require("../models/card");
const { Collection, Deck } = require("../models/collection");

describe("The deck", () => {
    let deck;

    beforeEach(() => {
        deck = new Deck([new Card(1, "red")]);
    })

    describe("when peeking at the top card", () => {
        let top;
        
        beforeEach(() => {
            top = deck.peekTop();
        })

        it("should return a copy of the top card", () => {
            expect(top).toEqual(deck.getTopCard());
        });

        describe("and modifying the returned copy", () => {
            it("should not change the top card of the deck", () => {
                top.value = 2;
                top.suit = "tuxedo";
                expect(top).not.toEqual(deck.getTopCard());
            })
        })
    });
    
    
});