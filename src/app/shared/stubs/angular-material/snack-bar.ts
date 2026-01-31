import { Injectable, NgModule } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MatSnackBar {
  open(_message: string, _action?: string, _config?: { duration?: number }) {
    return undefined;
  }
}

@NgModule({})
export class MatSnackBarModule {}
