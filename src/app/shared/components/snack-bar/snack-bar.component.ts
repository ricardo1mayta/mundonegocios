import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

type SnackBarData = {
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="snackbar-root">
      <div class="snackbar-content">
        <div class="snackbar-title">{{ title }}</div>
        <div class="snackbar-message">{{ data.message }}</div>
      </div>
      <button type="button" class="snackbar-close" aria-label="Cerrar" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
})
export class SnackBarComponent {
  get title(): string {
    if (this.data.title) return this.data.title;
    switch (this.data.type) {
      case 'success':
        return 'Éxito';
      case 'warning':
        return 'Advertencia';
      case 'error':
        return 'Error';
      default:
        return 'Información';
    }
  }
  constructor(
    private readonly ref: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData
  ) {}

  close() {
    this.ref.dismiss();
  }
}
