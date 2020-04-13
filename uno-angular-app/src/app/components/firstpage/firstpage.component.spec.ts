import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { firstpageComponent } from './firstpage.component';

describe('RegistrationComponent', () => {
  let component: firstpageComponent;
  let fixture: ComponentFixture<firstpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ firstpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(firstpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
