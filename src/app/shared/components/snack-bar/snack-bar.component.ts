import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

type SnackBarData = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="snackbar-root">
      <span class="snackbar-message">{{ data.message }}</span>
      <button type="button" class="snackbar-close" aria-label="Cerrar" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
})
export class SnackBarComponent {
  constructor(
    private readonly ref: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData
  ) {}

  close() {
    this.ref.dismiss();
  }
}
