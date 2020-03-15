import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  private username: string = "";

  constructor(private router: Router) {}

  ngOnInit() {}

  joinLobby(): void {
    this.router.navigate(["lobby", this.username]);
  }
}
