import { inject } from "@angular/core";
import { HttpEvent, HttpInterceptorFn } from "@angular/common/http";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { GobSnackBarService } from "../../shared/components";
import { throwError } from "rxjs";
import { environment } from "../../../environments/environment";

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackBarService = inject(GobSnackBarService);
  const duracion = 10000;

  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if ((event as any)?.body?.status) {
        const { code, status, message, errors } = (event as any).body.status;
        const numberCode = Number(code);

        const isSuccess = status === "success" || [201, 202, 204].includes(numberCode) || numberCode === 200;

        if (!isSuccess && (numberCode || status === "error")) {
          if (numberCode >= 400) {
            const warnMessage = message || (errors?.length && errors[0].message) || "Error inesperado.";
            _snackBarService.open({
              type: numberCode === 404 ? "warning" : "error",
              message: warnMessage,
              duration: duracion,
            });
            return event;
          }
          let mensaje = "";
          if (errors?.length && errors[0].message) {
            mensaje = `Error (${numberCode}): ${errors[0].message}`;
          } else if (message) {
            mensaje = `Error (${numberCode}): ${message}`;
          } else {
            mensaje = `Error inesperado. Código: ${numberCode}`;
          }
          throw new Error(mensaje);
        }

        // ✅ Mostrar success SOLO si es success y el code NO es 200
        if (isSuccess && message && numberCode !== 200) {
          _snackBarService.open({
            type: "success",
            message,
            duration: duracion,
          });
        }
      }

      return event;
    }),
    catchError((err: HttpErrorResponse) => {
      if (req.url === environment.apiUrlBase) return throwError(() => err);

      let message = "";
      let title = "";
      if (err.error?.status) {
        const statusMsg = err.error.status.message;
        const detailMsg = err.error.data?.[0]?.message || err.error.status.errors?.[0]?.message || "";
        title = statusMsg || "Error";
        message = detailMsg || statusMsg || `Error inesperado! (${err.error.message})`;
      } else if (err.error instanceof ErrorEvent) {
        message = err.error.message;
      } else if (err.status && err.message) {
        title = `Error ${err.status}`;
        message = err.message;
      } else if (err.message) {
        message = err.message;
      } else {
        message = "Error inesperado";
      }

      if (err.status >= 400) {
        _snackBarService.open({
          type: err.status === 404 ? "warning" : "error",
          title,
          message,
          duration: duracion,
        });
      }
      return throwError(() => new Error(message));
    }),
  );
};
