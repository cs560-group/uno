import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  players = [];

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.players.subscribe(players => this.players = players)
  }

}
