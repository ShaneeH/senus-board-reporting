import { Component } from '@angular/core';

import { AddDocument } from './add-document/add-document';
import { ViewDocuments } from './view-documents/view-documents';

@Component({
  selector: 'app-documents',
  imports: [
    AddDocument,
    ViewDocuments
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents {}