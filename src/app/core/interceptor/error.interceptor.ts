import { inject } from '@angular/core';
import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GobSnackBarService } from '../../shared/components';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackBarService = inject(GobSnackBarService);
  const duracion = 10000;
  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if ((event as any)?.body?.status) {
        const SUCCESS_CODES = [200, 201, 202, 204];
        const { code, message, errors } = (event as any).body.status;
        const numberCode = Number(code);
        if (numberCode && !SUCCESS_CODES.includes(numberCode)) {
          // Se convierte en error para que se muestre el mensaje
          let mensaje = '';
          if (errors?.length && errors[0].message) {
            mensaje = `Error (${numberCode}): ${errors[0].message}`;
          } else if (message) {
            mensaje = `Error (${numberCode}): ${message}`;
          } else {
            mensaje = `Error inesperado. Código: ${numberCode}`;
          }
          throw new Error(mensaje);
        }
      }
      return event;
    }),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 403) {
        // Deja pasar el error para que lo maneje el interceptor correspondiente
        return throwError(() => err);
      }

      if (req.url === environment.apiUrlBase) {
        return throwError(() => err);
      }

      let message = '';
      if (err.error?.status) {
        if (err.error.status.errors?.length) {
          message = err.error.status.errors[0].message;
        }
        if (!message) {
          message = err.error.status.message;
        }
        if (!message) {
          message = `Error inesperado! (${err.error.message})`;
        }
      } else if (err.error instanceof ErrorEvent) {
        message = err.error.message;
      } else if (err.status && err.message) {
        message = `Error ${err.status}: ${err.message}`;
      } else if (err.message) {
        message = err.message;
      } else {
        message = 'Error inesperado';
      }

      _snackBarService.open({
        type: 'error',
        message,
        duration: duracion,
      });

      return throwError(() => new Error(message));
    })
  );
};
