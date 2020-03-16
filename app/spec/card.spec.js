const Card = require("../models/card");

describe("The card", () => {
    let card;
    beforeEach(() => {
        card = new Card(1, "blue");
    });

    describe("given another card with the same value", () => {
        it("is like it", () => {
            const sameValueCard = new Card(1, "");
            expect(card.isLike(sameValueCard)).toBeTruthy();
        });
    });

    describe("given another card with the same suit", () => {
        it("is like it", () => {
            const sameSuitCard = new Card(-1, "blue");
            expect(card.isLike(sameSuitCard)).toBeTruthy();
        });
    });

    describe("given another card that is wild", () => {
        it("is like it", () => {
            const wildCard = new Card(2, "");
            wildCard.isWild = true;
            expect(card.isLike(wildCard)).toBeTruthy();
        });
    });

    describe("given another card that does not have the same value, suit, and is not wild", () => {
        it("is not like it", () => {
            const other = new Card(-1, "");
            expect(card.isLike(other)).toBeFalsy();
        })
    })

    describe("given another card with the same values", () => {
        it("it is equal to it", () => {
            const other = new Card(1, "blue");
            expect(card.equals(other)).toEqual(true);
        });
    });

    describe("given another card wihout the same values", () => {
        it("it is not equal to it", () => {
            const other = new Card(1, "red");
            expect(card.equals(other)).toEqual(false);
        });
    });
});