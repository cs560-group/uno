import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCheckboxModule, MatSelectModule} from '@angular/material';

@Component({
  selector: 'app-singlemode',
  templateUrl: './singlemode.component.html',
  styleUrls: ['./singlemode.component.css']
})
export class singlemodeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  
  mode(): void {
    this.router.navigate(["games"]);
  }

}
