import { Component, OnInit, Input } from '@angular/core';
import {Card} from "@app/models/card";
import { GameService } from '@app/services/game.service';
import { getSupportedInputTypes } from '@angular/cdk/platform';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit {
  cards = [];
  count: number = 0;
  isMyTurn: boolean = false;
  private hasPassed: boolean = false;

  selectSuit: any;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.cards.subscribe(updatedCards => this.cards = updatedCards);
    this.gameService.isMyTurn.subscribe(isTurn => {
      this.isMyTurn = isTurn
      this.hasPassed = false;
    });
    this.gameService.selectSuit.subscribe(select => {
      this.selectSuit = select;
    })
  }

  pass() {
    this.hasPassed = true;
    this.gameService.pass();
  } 

  playWild(suit: string){
    console.log(this.selectSuit.index, suit)
    this.gameService.playCard(this.selectSuit.index, suit);
  }

  play(card_index: number) {
    this.gameService.playCard(card_index);
  }
}
