import { Game } from '@app/models/game';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class GameService {
    public playerCount: number = 0;

    constructor(private socket: Socket) {}

    public connect(username): void {
        this.socket.connect();
        this.socket.emit("newplayer", username);
        this.socket.on("lobbyUpdate", (playerCount) => {
            this.playerCount = playerCount;
            console.log("lobby update", this.playerCount);
        });
    }

    public disonnect(): void {
        this.socket.disconnect();
    }
}