import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TfidfResult {
  tfidf_scores: Array<{term: string, score: number}>;
  top_terms_per_document: Array<any>;
  vocabulary_size: number;
  document_count: number;
}

export interface PredictionResult {
  accuracy: number;
  predictions: Array<{title: string, predicted_category: string}>;
  prediction_distribution: {[key: string]: number};
  model_type: string;
  feature_count: number;
  training_samples: number;
  test_samples: number;
}

export interface Statistics {
  total_documents: number;
  columns: string[];
  missing_values: {[key: string]: number};
  numeric_summary?: any;
  text_statistics?: any;
  year_distribution?: {[key: string]: number};
  category_distribution?: {[key: string]: number};
}


@Injectable({
  providedIn: 'root'
})
export class Data {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  uploadData(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  analyzeTfidf(params?: any): Observable<TfidfResult> {
    return this.http.post<TfidfResult>(`${this.apiUrl}/analyze`, params || {});
  }

  predictCategory(): Observable<PredictionResult> {
    return this.http.post<PredictionResult>(`${this.apiUrl}/predict`, {});
  }

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/statistics`);
  }

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
