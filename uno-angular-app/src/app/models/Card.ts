export class Card {
    value: number = 1;
    suit: string = "blue";
    type: string = ""
    isWild: boolean = false;

    constructor(number: number, color: string, type: string, isWild: boolean) {
        this.value = number;
        this.suit = color;
        this.type = type;
        this.isWild = isWild
    }
}