import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadersComponent } from '@components/campaign/leaders/leaders.component';
import { SupportersComponent } from '@components/campaign/supporters/supporters.component';

const routes: Routes = [
  {
    path: 'lideres',
    component: LeadersComponent
  },
  {
    path: 'lideres/editar-lideres/:id',
    component: LeadersComponent
  },
  {
    path: 'seguidores',
    component: SupportersComponent
  },
  {
    path: 'seguidores/editar-seguidores/:id',
    component: SupportersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaingRoutingModule { }
