import { Component, Input, OnChanges } from '@angular/core';
import { Statistics } from '../../services/data';

@Component({
  selector: 'app-statistics-component',
  standalone: false,
  templateUrl: './statistics-component.html',
  styleUrl: './statistics-component.css'
})
export class StatisticsComponent {
@Input() data: Statistics | null = null;
  yearLabels: string[] = [];
  yearValues: number[] = [];

  ngOnChanges(): void {
    if (this.data && this.data.year_distribution) {
      this.yearLabels = Object.keys(this.data.year_distribution);
      this.yearValues = Object.values(this.data.year_distribution);
    }
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getMaxValue(obj: {[key: string]: number}): number {
    return Math.max(...Object.values(obj));
  }
}
