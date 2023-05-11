import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from '@components/candidate/candidate.component';
import { CreateCandidateComponent } from '@components/create.candidate/create.candidate.component';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { LoginComponent } from '@components/login/login.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ResetPasswordComponent } from '@components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: DashboardComponent, ...authGuard() },
  { path: 'candidato', component: CandidateComponent, ...authGuard() },
  { path: 'crear-candidato', component: CreateCandidateComponent, ...authGuard() },
  { path: 'editar-candidato/:id', component: CreateCandidateComponent, ...authGuard() },
  {
    path: 'campaña',
    loadChildren: () => import('./components/campaign/campaing.module').then(m => m.CampaingModule), ...authGuard()
  },
  {
    path: 'elecciones',
    loadChildren: () => import('./components/elections/elections.module').then(m => m.ElectionsModule), ...authGuard()
  },
  { path: 'inicio-sesion', component: LoginComponent },
  { path: 'recuperar', component: ResetPasswordComponent },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

function authGuard() {
  return canActivate(() => redirectUnauthorizedTo(['/inicio-sesion']));
}
