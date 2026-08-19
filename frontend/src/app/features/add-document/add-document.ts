import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { CompanyService } from '../../core/services/company.service';
import { UploadReportResponse } from '../../core/models/upload-report.model';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [],
  templateUrl: './add-document.html',
  styleUrl: './add-document.scss'
})
export class AddDocument {
  private companyService = inject(CompanyService);

  selectedFile: File | null = null;
  isUploading = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Reads the file selected from the upload input.
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Only allow PDF documents through the frontend.
    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Please select a PDF document.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;

    // Clear any old messages when a new file is selected.
    this.errorMessage = null;
    this.successMessage = null;
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a document first.';
      return;
    }

    // Lock the upload button and clear any previous result.
    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.companyService.addDocument(this.selectedFile).subscribe({
      next: (response: UploadReportResponse) => {
        console.log('Upload response:', response);

        this.successMessage = 'Document analysed and added successfully.';
        this.selectedFile = null;
        this.isUploading = false;
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to upload document:', error);

        // Use the backend message when one is available.
        this.errorMessage =
          error.error?.error ??
          'Something went wrong while analysing the document.';

        this.isUploading = false;
      }
    });
  }
}