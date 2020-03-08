import { Component, OnInit, Input } from '@angular/core';
import {Card} from "@app/models/card";
import { CardService } from '@app/services/card.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit {
  public total: number;
  public cards: Card[];

  constructor(private cardService: CardService) { }

  ngOnInit() {
    this.cards = this.cardService.getStubbedCards(24);
    this.total = this.cards.length;
  }
}
