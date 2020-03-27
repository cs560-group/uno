import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HandComponent } from '@app/components/hand/hand.component';
import { CardComponent } from '@app/components/card/card.component';
import { LobbyComponent } from '@app/components/lobby/lobby.component';
import { Routes, RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GameService } from '@app/services/game.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './components/game/game.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { RegistrationComponent } from './components/registration/registration.component';
import {MatTableModule} from '@angular/material/table';
import { LobbyTableComponent } from './components/lobby-table/lobby-table.component';
import { LobbyViewComponent } from './components/lobby-view/lobby-view.component';


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
    GameComponent,
    RegistrationComponent,
    LobbyTableComponent,
    LobbyViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    NoopAnimationsModule,
    MatProgressSpinnerModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
