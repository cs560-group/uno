import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from "@app/components/lobby/lobby.component";
import { GameComponent } from '@app/components/game/game.component';

const routes: Routes = [
  { path: "lobby/:username", component: LobbyComponent },
  { path: "game/:id", component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
