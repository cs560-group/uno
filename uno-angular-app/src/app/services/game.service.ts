import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';
import { Card } from '@app/models/card';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class GameService {
    private _state = new BehaviorSubject<any>({});
    readonly state = this._state.asObservable();
    private _cards = new BehaviorSubject<Card[]>([]);
    readonly cards = this._cards.asObservable();
    private _currentPlayer = new BehaviorSubject<string>("");
    readonly currentPlayer = this._currentPlayer.asObservable();

    constructor(private socket: Socket) {
        this.socket.on("update", (data) => {
            console.log(data);
            this._state.next(Object.assign({}, data));
            const cardsInHand = data.private.hand.cards.map(card => new Card(card.value, card.suit, "", false));
            this._cards.next(Object.assign([], cardsInHand));
            this._currentPlayer.next(data.currentPlayer.name);
        });
    }

    getCardsInHand() {
        return this._cards.asObservable();
    }
}