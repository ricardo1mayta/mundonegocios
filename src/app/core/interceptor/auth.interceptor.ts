import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken;

  // ► Rutas que deben ENVIARSE SIN TOKEN
  const bypass = ['/api/auth/login', '/img_publicas/serviceimgprod.php'];

  if (bypass.some(p => req.url.includes(p)) || !token) {
    return next(req); //   ⬅ sale tal-cual
  }

  // ► Para todo lo demás, añade Authorization
  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
