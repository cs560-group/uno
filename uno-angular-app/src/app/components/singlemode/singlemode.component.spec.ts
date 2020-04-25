import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { singlemodeComponent } from './singlemode.component';
import { RouterOutlet } from '@angular/router';
import { Socket } from 'ngx-socket-io';

describe('RegistrationComponent', () => {
  let component: singlemodeComponent;
  let fixture: ComponentFixture<singlemodeComponent>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ singlemodeComponent, RouterOutlet],
      providers: [Socket]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(singlemodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
