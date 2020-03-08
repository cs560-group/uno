export class Card {
    number: number = 1;
    color: string = "blue";
    type: string = ""
    isWild: boolean = false;

    constructor(number: number, color: string, type: string, isWild: boolean) {
        this.number = number;
        this.color = color;
        this.type = type;
        this.isWild = isWild
    }
}