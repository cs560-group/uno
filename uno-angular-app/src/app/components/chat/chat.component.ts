import { Component, OnInit } from '@angular/core';
import Message from '@app/models/message';
import { Socket } from 'ngx-socket-io';
import UserService from '@app/services/user.service';
import { GameService } from '@app/services/game.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = new Array<Message>();
  message: string;
  private currentGameId: string = "";

  constructor(private socket: Socket, private userService: UserService, private gameService: GameService) { }

  ngOnInit() {
    this.socket.on("message", message => {
      const sentAt = new Date(message.sent).toLocaleTimeString();
      const newMessage = new Message(message.sender, message.content, sentAt);
      this.messages.push(newMessage);
    });
    this.gameService.gameId.subscribe(id => this.currentGameId = id);
  }

  sendMessage(): void {
    if (this.message.trim().length > 0) {
      this.socket.emit("message", 
      { 
        gameId: this.currentGameId, 
        message: new Message(this.userService.username, this.message, new Date().toUTCString())
      });
    };
    this.message = "";
  }

}
