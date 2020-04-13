import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from "@app/components/lobby/lobby.component";
import { GameComponent } from '@app/components/game/game.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { firstpageComponent } from './components/firstpage/firstpage.component';
import { secondpageComponent } from './components/secondpage/secondpage.component';

const routes: Routes = [
  { path: "", component: firstpageComponent },
  { path: "mode", component: secondpageComponent },
  { path: "register", component: RegistrationComponent },
  { path: "lobby/:username", component: LobbyComponent },
  { path: "game/:id", component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
