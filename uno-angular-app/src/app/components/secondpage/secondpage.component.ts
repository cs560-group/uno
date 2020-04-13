import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secondpage',
  templateUrl: './secondpage.component.html',
  styleUrls: ['./secondpage.component.css']
})
export class secondpageComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  mode(): void {
    this.router.navigate(["register"]);
  }
}
