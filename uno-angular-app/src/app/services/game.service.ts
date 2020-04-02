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
    private _gameIsOver = new BehaviorSubject<boolean>(false);
    readonly gameIsOver = this._gameIsOver.asObservable();
    private _winner = new BehaviorSubject<string>("");
    readonly winner = this._winner.asObservable();
    private _gameId = new BehaviorSubject<string>("");
    readonly gameId = this._gameId.asObservable();

    constructor(private socket: Socket) {
        this.socket.on("update", (data) => {
            console.log(data);
            this._state.next(Object.assign({}, data));
            this._gameId.next(data.game.id);
            const cardsInHand = data.hand.cards.map(card => new Card(card.value.toString(), card.suit, "", card.isWild));
            this._cards.next(Object.assign([], cardsInHand));
            this._currentPlayer.next(data.game.currentPlayer);
            this._isMyTurn.next(data.myTurn);
            this._discard.next(data.game.discard.top);
        });

        this.socket.on("gameOver", (data) => {
            this._winner.next(data.winner);
            this._gameIsOver.next(true);
            this._gameId.next("");
        })
    }

    

    getCardsInHand() {
        return this._cards.asObservable();
    }

    pass() {
        this.socket.emit("pass", { gameId: this._state.getValue().game.id, playerId: this._state.getValue().id });
    }

    playCard(card_index: number) {
        this.socket.emit("playCard", { gameId: this._state.getValue().game.id, playerId: this._state.getValue().id, card_index: card_index });
    }
}