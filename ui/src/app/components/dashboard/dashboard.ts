import { Component, OnInit } from '@angular/core';
import { TfidfResult, PredictionResult, Statistics } from '../../services/data';
import { Data } from '../../services/data';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  loading = false;
  tfidfData: TfidfResult | null = null;
  predictionData: PredictionResult | null = null;
  statisticsData: Statistics | null = null;
  error: string | null = null;
  isTitle: boolean = false;

  constructor(private dataService: Data) { }

  ngOnInit(): void {
    this.loadAllData();
  }

hasTitles(): void {
  this.isTitle = !!this.predictionData?.predictions?.some(p => p.title);
}



  loadAllData(): void {
    this.loading = true;
    this.error = null;

    // Load statistics first
    this.dataService.getStatistics().subscribe({
      next: (stats: any) => {
        this.statisticsData = stats;
        this.analyzeTfidf();
      },
      error: (err: any) => {
        this.error = 'Error loading statistics: ' + err.message;
        this.loading = false;
      }
    });
  }

  analyzeTfidf(): void {
    this.dataService.analyzeTfidf({ max_features: 50 }).subscribe({
      next: (data: any) => {
        this.tfidfData = data;
        this.predictCategories();
      },
      error: (err: any) => {
        this.error = 'Error analyzing TF-IDF: ' + err.message;
        this.loading = false;
      }
    });
  }

  predictCategories(): void {
    this.dataService.predictCategory().subscribe({
      next: (data: any) => {
        this.predictionData = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error predicting categories: ' + err.message;
        this.loading = false;
      }
    });
  }

  onFileUploaded(): void {
    this.loadAllData();
  }

  refresh(): void {
    this.loadAllData();
  }
}
