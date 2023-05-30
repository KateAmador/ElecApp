import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WitnessesComponent } from './witnesses/witnesses.component';
import { PlacesComponent } from './places/places.component';

const routes: Routes = [
  {
    path: 'testigos',
    component: WitnessesComponent
  },
  {
    path: 'testigos/editar-testigos/:id',
    component: WitnessesComponent
  },
  {
    path: 'puestos',
    component: PlacesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionsRoutingModule { }
