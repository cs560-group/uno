import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import Lobby from "@app/models/lobby";

@Injectable({
    providedIn: "root"
})
export class LobbyService {

    private _lobbies: BehaviorSubject<Lobby[]> = new BehaviorSubject<Lobby[]>([]);
    lobbies: Observable<Lobby[]> = this._lobbies.asObservable();

    constructor() {
        const lobbies = [
            new Lobby("Jim's game", ["Bob", "Francine", "Dilbert"]),
            new Lobby("Pam's game", ["Michael Scott", "Kevin", "Dwight Schrute"]),
            new Lobby("Oscar's Party", ["Phylis", "George Takei", "'Danger' Dick Davis"])
        ]
        this._lobbies.next(lobbies);
    }
}