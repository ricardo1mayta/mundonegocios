import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PrimeNgModule } from "../../../core/modules/primeng/primeng.module";

type ImagePreviewData = {
  src: string;
  alt?: string;
};

@Component({
  selector: "app-image-preview-dialog",
  standalone: true,
  imports: [CommonModule, PrimeNgModule],
  templateUrl: "./image-preview-dialog.component.html",
})
export class ImagePreviewDialogComponent {
  data = inject(MAT_DIALOG_DATA) as ImagePreviewData;
}
