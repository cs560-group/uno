import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GameService } from '@app/services/game.service';
import { Card } from '@app/models/card';
import { Router } from '@angular/router';
import UserService from '@app/services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  private currentPlayer: string = "";
  private discard: Card;
  private gameIsOver: boolean = false;
  private winner: string = "";

  constructor(private gameService: GameService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.gameService.currentPlayer.subscribe(player => this.currentPlayer = player);
    this.gameService.discard.subscribe(card => {
      this.discard = new Card(card.value, card.suit, card.type, card.isWild)
    });
    this.gameService.gameIsOver.subscribe(isOver => {
      this.gameIsOver = isOver;
      if (this.gameIsOver) {
        this.router.navigate(["/"]);
        alert(`The winner is ${this.winner}`);
      }
    });
    this.gameService.winner.subscribe(winner => this.winner = winner);
  }

}
