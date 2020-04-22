import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { singlemodeComponent } from './singlemode.component';

describe('RegistrationComponent', () => {
  let component: singlemodeComponent;
  let fixture: ComponentFixture<singlemodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ singlemodeComponent ]
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
