import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AppRoutingModule } from '@app/app-routing.module';
import { Router, ActivatedRoute } from '@angular/router';
import UserService from '@app/services/user.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  private userId: string = "";
  private players: any = [];

  constructor(private socket: Socket, private userService: UserService, private router: Router, private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.socket.on("lobbyUpdate", data => this.players = data);
    this.socket.on("playerId", assignedId => this.userId = assignedId);
    this.socket.on("start", gameId => this.router.navigate(["game", gameId]));
    this.activeRoute.params.subscribe(params => {
      const username = params.username;
      this.userService.username = username;
      this.socket.emit("newPlayer", username);
    });
  }
}
