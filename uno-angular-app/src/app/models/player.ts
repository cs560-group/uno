import { Card } from '@app/models/Card';

export class Player {
    id: number;
    cards: Card[];
    constructor(id: number) {
        this.id = id;
    }
}