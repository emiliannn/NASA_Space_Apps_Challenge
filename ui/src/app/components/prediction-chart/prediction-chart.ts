import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PredictionResult } from '../../services/data';

@Component({
  selector: 'app-prediction-chart',
  standalone: false,
  templateUrl: './prediction-chart.html',
  styleUrl: './prediction-chart.css'
})
export class PredictionChart {
@Input() data: PredictionResult | null = null;
  @ViewChild('pieCanvas', { static: false }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  private colors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
  ];

  ngAfterViewInit(): void {
    if (this.data) {
      this.drawChart();
    }
  }

  ngOnChanges(): void {
    if (this.data && this.pieCanvas) {
      this.drawChart();
    }
  }

  drawChart(): void {
    if (!this.data || !this.pieCanvas) return;

    const canvas = this.pieCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    ctx.clearRect(0, 0, width, height);

    const distribution = this.data.prediction_distribution;
    const entries = Object.entries(distribution);
    const total = entries.reduce((sum, [, count]) => sum + count, 0);

    let currentAngle = -Math.PI / 2;

    entries.forEach(([category, count], index) => {
      const sliceAngle = (count / total) * 2 * Math.PI;
      
      ctx.fillStyle = this.colors[index % this.colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);
      
      const percentage = ((count / total) * 100).toFixed(1);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage}%`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    const legendX = 20;
    let legendY = height - (entries.length * 25) - 20;

    entries.forEach(([category, count], index) => {
      ctx.fillStyle = this.colors[index % this.colors.length];
      ctx.fillRect(legendX, legendY, 15, 15);
      
      ctx.fillStyle = '#2c3e50';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${category} (${count})`, legendX + 20, legendY + 11);
      
      legendY += 25;
    });

    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Category Distribution', width / 2, 20);
  }
}
