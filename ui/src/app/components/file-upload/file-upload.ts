import { Component, Output, EventEmitter } from '@angular/core';
import { Data } from '../../services/data';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload {
 @Output() fileUploaded = new EventEmitter<void>();
  
  selectedFile: File | null = null;
  uploading = false;
  message = '';
  isError = false;

  constructor(private dataService: Data) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.selectedFile = file;
      this.message = `Selected: ${file.name}`;
      this.isError = false;
    } else {
      this.selectedFile = null;
      this.message = 'Please select a CSV file';
      this.isError = true;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.message = 'Please select a file first';
      this.isError = true;
      return;
    }

    this.uploading = true;
    this.dataService.uploadData(this.selectedFile).subscribe({
      next: (response) => {
        this.message = `Success! Loaded ${response.rows} rows`;
        this.isError = false;
        this.uploading = false;
        this.fileUploaded.emit();
      },
      error: (error) => {
        this.message = `Error: ${error.error?.error || error.message}`;
        this.isError = true;
        this.uploading = false;
      }
    });
  }

  useSampleData(): void {
    this.uploading = true;
    this.message = 'Loading sample data...';
    
    // Call upload without file to trigger sample data
    this.dataService.uploadData(new File([], '')).subscribe({
      next: (response) => {
        this.message = `Sample data loaded! ${response.rows} rows`;
        this.isError = false;
        this.uploading = false;
        this.fileUploaded.emit();
      },
      error: (error) => {
        this.message = `Error: ${error.error?.error || error.message}`;
        this.isError = true;
        this.uploading = false;
      }
    });
  }
}
