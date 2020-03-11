import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HandComponent } from '@app/components/hand/hand.component';
import { CardComponent } from '@app/components/card/card.component';
import { CardService } from '@app/services/card.service';
import { LobbyComponent } from '@app/components/lobby/lobby.component';
import { Routes, RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GameService } from '@app/services/game.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './components/game/game.component';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };
const appRoutes: Routes = [
  { path: 'lobby', component: LobbyComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    HandComponent,
    CardComponent,
    LobbyComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    MatToolbarModule,
    NoopAnimationsModule,
    MatProgressSpinnerModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [CardService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
