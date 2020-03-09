import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { Game } from '@app/models/game';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit() {}

}
