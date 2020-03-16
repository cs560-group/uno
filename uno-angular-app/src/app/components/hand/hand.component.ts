import { Component, OnInit, Input } from '@angular/core';
import {Card} from "@app/models/card";
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit {
  cards;
  count: number = 0;
  isMyTurn: boolean = false;
  private hasPassed: boolean = false;
  

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.cards.subscribe(updatedCards =>  this.cards = updatedCards);
    this.gameService.isMyTurn.subscribe(isTurn => {
      this.isMyTurn = isTurn
      this.hasPassed = false;
    });
  }

  pass() {
    this.hasPassed = true;
    this.gameService.pass();
  } 
}
