import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard-module').then(m => m.DashboardModule) },
  { path: 'file-upload', loadChildren: () => import('./components/file-upload/file-upload-module').then(m => m.FileUploadModule) },
  { path: 'prediction-chart', loadChildren: () => import('./components/prediction-chart/prediction-chart-module').then(m => m.PredictionChartModule) },
  { path: 'statistics', loadChildren: () => import('./components/statistics-component/statistics-component-module').then(m => m.StatisticsComponentModule) },
  { path: 'tfidf-chart', loadChildren: () => import('./components/tfidf-chart/tfidf-chart-module').then(m => m.TfidfChartModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
