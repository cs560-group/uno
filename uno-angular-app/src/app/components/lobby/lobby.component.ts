import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AppRoutingModule } from '@app/app-routing.module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  username: string = "";
  private id: string = "";

  private playerCount: number = 0;

  constructor(private socket: Socket, private router: Router, private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.socket.on("playerId", assignedId => this.id = assignedId);
    this.socket.on("lobbyUpdate", data => this.playerCount = data.playerCount);
    this.socket.on("start", () => this.router.navigate(["game"]));
    this.activeRoute.params.subscribe(params => {
      this.username = params.username;
      this.joinLobby();
    });
  }

  joinLobby() {
    this.socket.emit("newplayer", this.username);
  }
}
