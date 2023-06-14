import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WitnessesComponent } from './witnesses/witnesses.component';
import { PlacesComponent } from './places/places.component';
import { ReportsComponent } from './reports/reports.component';

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
  },
  {
    path: 'puestos/editar-puestos/:id',
    component: PlacesComponent
  },
  {
    path: 'reportes',
    component: ReportsComponent
  },
  {
    path: 'reportes/editar-reportes/:id',
    component: ReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionsRoutingModule { }
