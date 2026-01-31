import { Component, Directive, Injectable, InjectionToken, Input, NgModule, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const MAT_DIALOG_DATA = new InjectionToken<unknown>('MAT_DIALOG_DATA');

export interface MatDialogConfig<T = unknown> {
  data?: T;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  height?: string;
  hasBackdrop?: boolean;
  disableClose?: boolean;
  panelClass?: string | string[];
}

export class MatDialogRef<T = unknown, R = unknown> {
  private readonly closed$ = new Subject<R | undefined>();

  close(result?: R) {
    this.closed$.next(result);
    this.closed$.complete();
  }

  afterClosed(): Observable<R | undefined> {
    return this.closed$.asObservable();
  }
}

@Injectable({ providedIn: 'root' })
export class MatDialog {
  open<T>(_: unknown, __?: MatDialogConfig<T>): MatDialogRef<T> {
    return new MatDialogRef<T>();
  }

  closeAll() {
    return;
  }
}

@Component({
  selector: 'mat-dialog-content',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatDialogContent {}

@Component({
  selector: 'mat-dialog-actions',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MatDialogActions {}

@Directive({
  selector: '[mat-dialog-close]',
  standalone: true,
})
export class MatDialogClose {
  @Input('mat-dialog-close') dialogResult?: unknown;
}

@Directive({
  selector: '[matDialogClose]',
  standalone: true,
})
export class MatDialogCloseAlias {
  @Input('matDialogClose') dialogResult?: unknown;
}

@Directive({
  selector: '[matDialogContent]',
  standalone: true,
})
export class MatDialogContentAlias {
  constructor(public templateRef: TemplateRef<unknown>, public viewContainerRef: ViewContainerRef) {}
}

@NgModule({
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogCloseAlias],
  exports: [MatDialogContent, MatDialogActions, MatDialogClose, MatDialogCloseAlias],
})
export class MatDialogModule {}
