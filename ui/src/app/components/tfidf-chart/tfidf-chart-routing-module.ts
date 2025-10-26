import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TfidfChart } from './tfidf-chart';

const routes: Routes = [{ path: '', component: TfidfChart }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TfidfChartRoutingModule { }
