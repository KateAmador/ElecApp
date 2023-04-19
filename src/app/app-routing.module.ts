import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from '@components/candidate/candidate.component';
import { CreateCandidateComponent } from '@components/create.candidate/create.candidate.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { LeadersComponent } from '@components/leaders/leaders.component';
import { SettingsComponent } from '@components/settings/settings.component';
import { SupportersComponent } from '@components/supporters/supporters.component';
import { WitnessesComponent } from '@components/witnesses/witnesses.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: DashboardComponent },
  { path: 'candidato', component: CandidateComponent },
  { path: 'crear-candidato', component: CreateCandidateComponent },
  { path: 'editar-candidato/:id', component: CreateCandidateComponent },
  { path: 'lideres', component: LeadersComponent },
  { path: 'editar-lideres/:id', component: LeadersComponent },
  { path: 'seguidores', component: SupportersComponent },
  { path: 'testigos', component: WitnessesComponent },
  { path: 'configuracion', component: SettingsComponent },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
