import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TfidfChartRoutingModule } from './tfidf-chart-routing-module';
import { TfidfChart } from './tfidf-chart';


@NgModule({
  declarations: [
    TfidfChart
  ],
  imports: [
    CommonModule,
    TfidfChartRoutingModule
  ],
  exports: [TfidfChart]
})
export class TfidfChartModule { }
