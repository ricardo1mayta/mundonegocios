import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

type SnackBarPayload = {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
};

@Injectable({ providedIn: 'root' })
export class GobSnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  open(payload: SnackBarPayload) {
    const { message, type = 'info', duration = 4000 } = payload;
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message, type },
      duration,
      panelClass: [`snackbar-${type}`],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
