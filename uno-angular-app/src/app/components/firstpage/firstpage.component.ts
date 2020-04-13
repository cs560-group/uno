import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})
export class firstpageComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  start(): void {
    this.router.navigate(["mode"]);
  }
}
