import { Component, OnInit, Input } from '@angular/core';
import {Card} from "@app/models/card";
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit {
  public cards;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.cards = this.gameService.cards;
    this.cards = this.gameService.getCardsInHand();
  }
}
