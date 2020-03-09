import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from "@app/components/lobby/lobby.component";
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: "lobby", component: LobbyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
