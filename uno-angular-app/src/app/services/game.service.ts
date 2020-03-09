import { Game } from '@app/models/game';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class GameService {
    public playerCount: number = 0;

    constructor(private socket: Socket) {}

    public connect(): void {
        this.socket.connect();
        console.log("connecting...");
        this.socket.on("players", (playerCount) => {
            console.log(playerCount);
            this.playerCount = playerCount;
            console.log(this.playerCount);
        });
    }

    public disonncect(): void {
        this.socket.disconnect();
    }
}