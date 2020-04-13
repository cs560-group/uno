import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { secondpageComponent } from './secondpage.component';

describe('RegistrationComponent', () => {
  let component: secondpageComponent;
  let fixture: ComponentFixture<secondpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ secondpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(secondpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
