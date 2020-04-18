import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import UserService from '@app/services/user.service';
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'app-unocall',
  templateUrl: './unobutton.component.html',
  styleUrls: ['./unobutton.component.css']
})
export class UnobuttonComponent implements OnInit {

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

  unobutton() {
    console.log("***** DEBUG: unobutton.component.ts print test")
    if(!this.challenge) {
      this.gameService.unoButton();
    }
  }

}
