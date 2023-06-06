import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ElectionsRoutingModule } from './elections-routing.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ElectionsRoutingModule
  ],
  providers: [DatePipe]
})
export class ElectionsModule { }
