import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectionsRoutingModule } from './elections-routing.module';
import { PlacesComponent } from './places/places.component';


@NgModule({
  declarations: [
    PlacesComponent
  ],
  imports: [
    CommonModule,
    ElectionsRoutingModule
  ]
})
export class ElectionsModule { }
