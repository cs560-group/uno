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
    private _isMyTurn = new BehaviorSubject<boolean>(false);
    readonly isMyTurn = this._isMyTurn.asObservable();
    private _discard = new BehaviorSubject<Card>(null);
    readonly discard = this._discard.asObservable();

    constructor(private socket: Socket) {
        this.socket.on("update", (data) => {
            console.log(data);
            this._state.next(Object.assign({}, data));
            const cardsInHand = data.hand.cards.map(card => new Card(card.value, card.suit, "", false));
            this._cards.next(Object.assign([], cardsInHand));
            this._currentPlayer.next(data.game.currentPlayer);
            this._isMyTurn.next(data.myTurn);
            this._discard.next(data.game.discard.top);
        });
    }

    getCardsInHand() {
        return this._cards.asObservable();
    }

    pass() {
        this.socket.emit("pass", { gameId: this._state.getValue().game.id, playerId: this._state.getValue().id });
    }
}