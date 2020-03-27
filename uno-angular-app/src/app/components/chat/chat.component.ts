import { Component, OnInit } from '@angular/core';
import Message from '@app/models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[];
  message: string;

  constructor() { }

  ngOnInit() {
    this.messages = [
      new Message("Levi", "Hi!", new Date().toLocaleTimeString()),
      new Message("Bob", "Hi Levi!", new Date().toLocaleTimeString()),
      new Message("Levi", "How are you?", new Date().toLocaleTimeString()),
      new Message("Bob", "Doing Well! You?", new Date().toLocaleTimeString()),
      new Message("Levi", "I'm great!", new Date().toLocaleTimeString()),
    ];
  }

  sendMessage(): void {
    this.messages.push(new Message("Levi", this.message, new Date().toLocaleTimeString()));
    this.message = "";
  }

}
