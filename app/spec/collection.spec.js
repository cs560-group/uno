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
});