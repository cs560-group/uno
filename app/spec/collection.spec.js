const { Collection } = require("../models/collection");
const Card = require("../models/card");

describe("The collection", () => {
    describe("when sending a card to another collection", () => {
        it("removes the card from the source and adds it to the destination collection", () => {
            const source = new Collection();
            const card = {};
            source.addCard(card, false);
            const destination = new Collection();
            source.sendCard(0, destination, false);
            expect(source.count()).toBe(0);
            expect(destination.count()).toBe(1);
            expect(destination.getTopCard()).toBe(card);
        });
        it("should return a copy of the card sent", () => {
            const deck = new Collection([new Card(1, "blue")])
            const indexOfCard = 0;
            const card = deck.cards[indexOfCard];
            const cardSent = deck.sendCard(indexOfCard, new Collection(), false)
            cardSent.value = 9001;
            expect(card).not.toEqual(cardSent);
        });
    });

    describe("when finding the index of a card in the collection", () => {
        it("should return the index of the card", () => {
            const card = new Card(1, "blue");
            const collection = new Collection([new Card(2, "red"), card]);
            expect(collection.indexOf(card)).toEqual(1);
        });
    });

    describe("when finding the index of a card not in the collection", () => {
        it("should return -1", () => {
            const card = new Card(1, "blue");
            const collection = new Collection([new Card(2, "red"), new Card(2, "green")]);
            expect(collection.indexOf(card)).toEqual(-1);
        })
    })
});