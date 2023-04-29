import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadersComponent } from './leaders/leaders.component';
import { SupportersComponent } from './supporters/supporters.component';

const routes: Routes = [
  {
    path: 'lideres',
    component: LeadersComponent
  },
  // {
  //   path: 'editar-lideres/:id',
  //   component: LeadersComponent
  // },
  {
    path: 'seguidores',
    component: SupportersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaingRoutingModule { }
