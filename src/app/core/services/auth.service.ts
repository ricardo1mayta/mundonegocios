import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.apiUrlBase;

  /** signal global – reactiva en cualquier componente */
  readonly usuario = signal<any>(this.safeParse(localStorage.getItem('datosUsuario')));

  constructor(private http: HttpClient, private router: Router) {}

  /** login */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/api/auth/login`, credentials).pipe(
      tap((res: any) => {
        // 1. tokens
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('expiresAt', res.expiresAt.toString());

        // 2. datos del usuario
        localStorage.setItem('datosUsuario', JSON.stringify(res.datosUsuario));
        this.usuario.set(res.datosUsuario); // <-- reactivo
      })
    );
  }
  safeParse<T = any>(raw: string | null): T | {} {
    if (!raw || raw === 'undefined') return {}; // ← evita el parse
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  /** logout */
  logout(): void {
    localStorage.clear(); // elimina todo
    this.usuario.set({}); // limpia la signal
    this.router.navigate(['/login']);
  }

  /* helpers ================================================================= */

  get accessToken() {
    return localStorage.getItem('accessToken');
  }
  get refreshToken() {
    return localStorage.getItem('refreshToken');
  }
  get expiresAt() {
    return +(localStorage.getItem('expiresAt') ?? 0);
  }

  isTokenExpired(): boolean {
    return !this.expiresAt || Date.now() > this.expiresAt;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !this.isTokenExpired();
  }
}
