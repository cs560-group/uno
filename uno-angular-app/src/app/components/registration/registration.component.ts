import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/userService';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  private username: string = "";

  constructor(private userService: UserService) {}

  ngOnInit() {}
  
  setDisplayName() {
    this.userService.setDisplayName(this.username);
  }
}
