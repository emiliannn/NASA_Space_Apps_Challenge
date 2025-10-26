import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FileUpload } from './components/file-upload/file-upload';
import { PredictionChart } from './components/prediction-chart/prediction-chart';
import { TfidfChart } from './components/tfidf-chart/tfidf-chart';
import { StatisticsComponent } from './components/statistics-component/statistics-component';
import { HttpClientModule } from '@angular/common/http'; 

@NgModule({
  declarations: [
    App,
    // FileUpload,
    // PredictionChart,
    // TfidfChart,
    // StatisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
