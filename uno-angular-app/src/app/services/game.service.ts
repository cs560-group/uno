import { Game } from '@app/models/game';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class GameService {
    public state: any;
    

    constructor(private socket: Socket) {
        this.socket.on("update", (data) => {this.state = data; console.log(this.state); });
    }

    currentPlayer() {
        return this.state ? this.state.currentPlayer.name : "";
    }
}