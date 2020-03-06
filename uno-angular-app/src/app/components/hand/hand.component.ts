import { Component, OnInit } from '@angular/core';
import Card from "@app/models/card";

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit {
  public total: number;
  public cards: Card[];

  constructor() { }

  ngOnInit() {
  }

}
