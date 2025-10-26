import { Component, Input, OnChanges, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { TfidfResult } from '../../services/data';

@Component({
  selector: 'app-tfidf-chart',
  standalone: false,
  templateUrl: './tfidf-chart.html',
  styleUrl: './tfidf-chart.css'
})
export class TfidfChart {
@Input() data: TfidfResult | null = null;
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    if (this.data) {
      this.drawChart();
    }
  }

  ngOnChanges(): void {
    if (this.data && this.chartCanvas) {
      this.drawChart();
    }
  }

  drawChart(): void {
    if (!this.data || !this.chartCanvas) return;

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const topTerms = this.data.tfidf_scores.slice(0, 15);
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 20, right: 20, bottom: 80, left: 60 };
    
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const maxScore = Math.max(...topTerms.map(t => t.score));

    const barWidth = chartWidth / topTerms.length - 10;
    
    topTerms.forEach((term, i) => {
      const barHeight = (term.score / maxScore) * chartHeight;
      const x = padding.left + (i * (chartWidth / topTerms.length)) + 5;
      const y = padding.top + chartHeight - barHeight;

      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#3498db');
      gradient.addColorStop(1, '#2980b9');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#2c3e50';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(term.score.toFixed(3), x + barWidth / 2, y - 5);

      ctx.save();
      ctx.translate(x + barWidth / 2, height - padding.bottom + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.textAlign = 'right';
      ctx.fillText(term.term, 0, 0);
      ctx.restore();
    });

    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TF-IDF Score', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Top Terms by TF-IDF Score', width / 2, 15);
  }

}
