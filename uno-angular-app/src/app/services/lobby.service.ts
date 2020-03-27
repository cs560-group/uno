import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import Lobby from "@app/models/lobby";
import { Router } from '@angular/router';
import { UserService } from '@app/services/userService';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: "root"
})
export class LobbyService {

    private _lobbies: BehaviorSubject<Lobby[]> = new BehaviorSubject<Lobby[]>([]);
    lobbies: Observable<Lobby[]> = this._lobbies.asObservable();

    constructor(private socket: Socket, private userService: UserService, private router: Router) {
        socket.on("lobbies", (lobbies: Lobby[]) => {
            this._lobbies.next(lobbies);
        });
        socket.emit("getLobbies");
    }

    joinLobby(lobby: Lobby, name: string): void {
        console.log(name + ' is joining ' + lobby.name);
        this.router.navigate(["lobby", lobby.id, name]);
    }
}