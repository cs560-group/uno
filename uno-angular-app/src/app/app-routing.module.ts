import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from "@app/components/lobby/lobby.component";
import { GameComponent } from '@app/components/game/game.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LobbyTableComponent } from './components/lobby-table/lobby-table.component';

const routes: Routes = [
  { path: "", component: LobbyTableComponent },
  { path: "lobby/:username", component: LobbyComponent },
  { path: "game/:id", component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
