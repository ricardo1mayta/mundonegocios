import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true; // token OK → continúa
  }

  auth.logout(); // limpia sesión
  return router.createUrlTree(['/login']); // redirige
};
