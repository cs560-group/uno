import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyTableComponent } from './lobby-table.component';

describe('LobbyTableComponent', () => {
  let component: LobbyTableComponent;
  let fixture: ComponentFixture<LobbyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
