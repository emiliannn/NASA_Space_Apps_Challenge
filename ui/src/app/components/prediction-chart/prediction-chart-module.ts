import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictionChartRoutingModule } from './prediction-chart-routing-module';
import { PredictionChart } from './prediction-chart';


@NgModule({
  declarations: [
    PredictionChart
  ],
  imports: [
    CommonModule,
    PredictionChartRoutingModule
  ],
  exports: [PredictionChart]
})
export class PredictionChartModule { }
