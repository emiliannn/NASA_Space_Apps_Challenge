import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredictionChart } from './prediction-chart';

const routes: Routes = [{ path: '', component: PredictionChart }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredictionChartRoutingModule { }
