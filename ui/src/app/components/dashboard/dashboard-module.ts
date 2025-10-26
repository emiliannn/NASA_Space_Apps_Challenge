import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard';
import { FileUploadModule } from '../file-upload/file-upload-module';
import { StatisticsComponentModule } from '../statistics-component/statistics-component-module';
import { TfidfChartModule } from '../tfidf-chart/tfidf-chart-module';
import { PredictionChartModule } from '../prediction-chart/prediction-chart-module';

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FileUploadModule,
    StatisticsComponentModule,
    TfidfChartModule,
    PredictionChartModule
  ]
})
export class DashboardModule { }
