import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

type ImagePreviewData = {
  src: string;
  alt?: string;
};

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogClose, MatButtonModule],
  templateUrl: './image-preview-dialog.component.html',
})
export class ImagePreviewDialogComponent {
  data = inject(MAT_DIALOG_DATA) as ImagePreviewData;
}
