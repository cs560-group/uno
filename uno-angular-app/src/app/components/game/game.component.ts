import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from '@app/services/game.service';
import { Card } from '@app/models/card';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  private currentPlayer: string = "";
  private discard: Card;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.currentPlayer.subscribe(player => this.currentPlayer = player);
    this.gameService.discard.subscribe(card => {
      console.log(card);
      this.discard = new Card(card.value, card.suit, card.type, card.isWild)
    });
  }

}
