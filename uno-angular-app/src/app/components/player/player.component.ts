import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input("player")
  player: {
    name: string,
    hand: {
      count: number
    },
    myTurn: boolean
  };

  cards;

  constructor() { }

  ngOnInit() {
    this.cards = [];
    for(let i = 0; i < this.player.hand.count; i++){
      this.cards.push(i);
    }
  }

}
