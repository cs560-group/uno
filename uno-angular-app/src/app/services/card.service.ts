import {Card} from "@app/models/card";

export class CardService {
    
    public getStubbedCards(count: number): Card[] {
        const cards = [];
        const colors = ["red", "blue", "green", "yellow"];
        for(let i = 1; i <= count; i++) {
            cards.push(new Card(i % 10, colors[i % colors.length], "Normal", false));
        }
        return cards;
    }
}