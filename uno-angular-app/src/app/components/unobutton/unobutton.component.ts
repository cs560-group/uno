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

  challenge: any;

  constructor(private gameService: GameService) { }

  ngOnInit() {  

    this.gameService.challenge.subscribe(challenge => {
      this.challenge = challenge;
    });

  }

  unobutton() {
    if(!this.challenge) {
      this.gameService.unoButton();
    }
  }

}
