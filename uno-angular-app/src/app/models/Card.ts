export class Card {
    value: string = "1";
    suit: string = "blue";
    type: string = ""
    isWild: boolean = false;
    artwork: string = "";

    constructor(value: string, color: string, type: string, isWild: boolean) {
        this.value = value;
        this.suit = color;
        this.type = type;
        this.isWild = isWild;
        this.artwork =  `/assets/cards/${this.suit}_${this.value}.png`;
    }
}