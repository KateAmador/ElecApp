import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WitnessesComponent } from './witnesses/witnesses.component';

const routes: Routes = [
  {
    path: 'testigos',
    component: WitnessesComponent
  },
  {
    path: 'testigos/editar-testigos/:id',
    component: WitnessesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionsRoutingModule { }
