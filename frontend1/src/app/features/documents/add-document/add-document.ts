import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UploadReportResponse } from '../../../core/models/upload-report.model';
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './add-document.html',
  styleUrl: './add-document.scss'
})
export class AddDocument {
  private readonly companyService = inject(CompanyService);

  readonly documentAdded = output<void>();

  selectedFile: File | null = null;
  uploadedFileName: string | null = null;
  isUploading = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.errorMessage = 'Please select a PDF document.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.uploadedFileName = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a document first.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.companyService.addDocument(this.selectedFile).subscribe({
      next: (response: UploadReportResponse) => {
        console.log('Upload response:', response);

        this.uploadedFileName = this.selectedFile?.name ?? null;
        this.successMessage = 'Document analysed and added successfully.';
        this.selectedFile = null;
        this.isUploading = false;
        this.documentAdded.emit();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to upload document:', error);

        this.errorMessage =
          error.error?.error ??
          'Something went wrong while analysing the document.';

        this.isUploading = false;
      }
    });
  }

  resetUpload(): void {
    this.selectedFile = null;
    this.uploadedFileName = null;
    this.successMessage = null;
    this.errorMessage = null;
  }
}
