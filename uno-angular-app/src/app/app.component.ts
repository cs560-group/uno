import { Component } from '@angular/core';
import { Card } from "@app/models/card";
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private gameService: GameService) {}
}
