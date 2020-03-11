import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  private username: string;

  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

  joinLobby() {
    console.log(`Joining lobby as ${this.username}`);
      this.gameService.connect(this.username);
  }

}
