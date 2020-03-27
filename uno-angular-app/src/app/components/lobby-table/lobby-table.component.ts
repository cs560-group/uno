import { Component, OnInit } from '@angular/core';
import Lobby from '@app/models/lobby';
import { LobbyService } from '@app/services/lobby.service';
import { Observable } from 'rxjs';
import { UserService } from '@app/services/userService';

@Component({
  selector: 'app-lobby-table',
  templateUrl: './lobby-table.component.html',
  styleUrls: ['./lobby-table.component.css']
})
export class LobbyTableComponent implements OnInit {
  columns: string[] = ["id", "name", "members", "join"];
  lobbies: Observable<Lobby[]>;
  name: string;

  constructor(private userService: UserService, private lobbyService: LobbyService) { }

  ngOnInit() {
    this.lobbies = this.lobbyService.lobbies;
    this.userService.name.subscribe(name => this.name = name);
  }

  joinLobby(lobby) {
    if (this.name.length > 0)
      this.lobbyService.joinLobby(lobby, this.name);
  }
}
