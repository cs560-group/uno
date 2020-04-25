import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCheckboxModule, MatSelectModule} from '@angular/material';
import { Socket } from 'ngx-socket-io';
import UserService from '@app/services/user.service';

@Component({
  selector: 'app-singlemode',
  templateUrl: './singlemode.component.html',
  styleUrls: ['./singlemode.component.css']
})
export class singlemodeComponent implements OnInit {

  private num: number = 0;
  private difficulty: number = 0;
  private userId: string = "";

  constructor(private socket: Socket, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.socket.on("playerId", assignedId => this.userId = assignedId);
    this.socket.on("start", gameId => this.router.navigate(["game", gameId]));
    this.userService.username = "Player";
  }

  setNum(num: number){
    this.num = num;
  }

  setDifficulty(diff: number){
    this.difficulty = diff;
  }

  startGame(){
    if(this.num > 0 && this.difficulty > 0){
      let data = {name: this.userService.username, numPlayers: this.num, difficulty: this.difficulty};
      console.log(data);
      this.socket.emit("singlePlayer", data);
    }
  }
}