import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this.snackBar.open(message, 'Cerrar', {
      duration,
      panelClass: [`snackbar-${type}`],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
