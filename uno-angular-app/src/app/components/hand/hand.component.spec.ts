import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from "@angular/platform-browser"
import { HandComponent } from './hand.component';
import { Card } from '@app/models/card';
import { CardComponent } from '../card/card.component';
import { Socket } from 'ngx-socket-io';

describe('The HandComponent', () => {
  let component: HandComponent;
  let fixture: ComponentFixture<HandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandComponent, CardComponent ],
      providers: [Socket]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should display the total number of cards in the player's hand", () => {
    component.cards = [new Card(1, "", "", false), new Card(2, "", "", false)]
    const totalElement = fixture.debugElement.query(By.css("#totalCards")).nativeElement;
    fixture.detectChanges();
    expect(totalElement.innerHTML).toEqual("2");
  });

  it("should display each card in the player's hand", () => {
    component.cards = [new Card(1, "blue", "", false), new Card(2, "red", "", false)];
    fixture.detectChanges();
    const cardElements = fixture.debugElement.queryAll(By.css("div"));
    expect(cardElements.length).toEqual(2);
  })
});
