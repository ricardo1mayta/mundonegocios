import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs/operators";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(["/login"]);
    return false;
  }

  return auth.rehydrateContext().pipe(
    map((ok) => {
      if (!ok) router.navigate(["/login"]);
      return ok;
    }),
  );
};