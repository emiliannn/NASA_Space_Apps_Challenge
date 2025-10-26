import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsComponentRoutingModule } from './statistics-component-routing-module';
import { StatisticsComponent } from './statistics-component';


@NgModule({
  declarations: [
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    StatisticsComponentRoutingModule
  ],
  exports: [StatisticsComponent]
})
export class StatisticsComponentModule { }
