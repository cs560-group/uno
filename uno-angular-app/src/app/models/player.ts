import { Card } from '@app/models/Card';

export class Player {
    private cards: Card[] = [];
    constructor(private id: number, ) {
        this.id = id;
    }
}