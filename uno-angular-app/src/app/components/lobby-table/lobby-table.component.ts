import { Component, OnInit } from '@angular/core';
import Lobby from '@app/models/lobby';
import { LobbyService } from '@app/services/lobby.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lobby-table',
  templateUrl: './lobby-table.component.html',
  styleUrls: ['./lobby-table.component.css']
})
export class LobbyTableComponent implements OnInit {
  lobbies: Observable<Lobby[]>;
  columns: string[] = ["id", "name", "members"];

  constructor(private lobbyService: LobbyService) { }

  ngOnInit() {
    this.lobbies = this.lobbyService.lobbies;
  }

}
