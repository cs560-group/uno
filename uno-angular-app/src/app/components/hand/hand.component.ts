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
  challenge: any;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.cards.subscribe(updatedCards => this.cards = updatedCards);
    this.gameService.isMyTurn.subscribe(isTurn => {
      this.isMyTurn = isTurn
      this.hasPassed = false;
    });

    this.gameService.selectSuit.subscribe(select => {
      this.selectSuit = select;
    });

    this.gameService.challenge.subscribe(challenge => {
      this.challenge = challenge;
    });
  }

  pass() {
    if(!this.challenge){
      this.hasPassed = true;
      this.gameService.pass();  
    }     
  } 

  playWild(suit: string){
    if(!this.challenge){
      this.gameService.playCard(this.selectSuit.index, suit);
    }
  }

  play(card_index: number) {
    if(!this.challenge){
      this.gameService.playCard(card_index);  
    }    
  }

  makeChallenge(challenge:boolean){
    this.gameService.makeChallenge(challenge);
  }
}
