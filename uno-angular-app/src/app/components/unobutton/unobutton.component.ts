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

  constructor(private gameService: GameService) { }

  ngOnInit() {}

  unobutton() {
    this.gameService.unoButton();
  }

}
