import { Injectable, signal, inject, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}
export interface ApiStatus {
  code: number;
  status: string;
  message: string;
}
export interface ApiResponse<T> {
  status: ApiStatus;
  data: T;
}
export interface MeResponse {
  nombresede: string;
  nombres: string;
  sedePadre: string;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  address: {
    direccion: string;
    provincia: string;
    departamento: string;
    distrito: string;
    ubigueo: string;
  } | null;
  direccion: string | null;
  logo: string | null;
  img: string | null;
}

const LS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  expiresAt: "expiresAt",
} as const;

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly API_URL = environment.apiUrlBase;
  private http = inject(HttpClient);
  private router = inject(Router);

  /** Tokens */
  readonly accessToken = signal<string | null>(localStorage.getItem(LS.accessToken));
  readonly refreshToken = signal<string | null>(localStorage.getItem(LS.refreshToken));
  readonly expiresAt = signal<number>(+(localStorage.getItem(LS.expiresAt) ?? 0));

  /** Contexto (/me) → SOLO memoria */
  readonly ctx = signal<MeResponse | null>(null);

  /* ===================== LOGIN ===================== */

  login(credentials: { username: string; password: string }): Observable<MeResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/api/auth/login`, credentials).pipe(
      tap((res) => this.saveTokens(res)),
      switchMap(() => this.loadContext()),
      tap((ctx) => this.ctx.set(ctx)),
    );
  }

  /* ===================== CONTEXTO ===================== */

  loadContext(): Observable<MeResponse> {
    return this.http.get<ApiResponse<MeResponse>>(`${this.API_URL}/pegasus/usuarios/me`).pipe(map((res) => res.data));
  }

  /** Se usa en guards: token existe, pero ctx aún no */
  rehydrateContext(): Observable<boolean> {
    if (!this.isAuthenticated()) return of(false);
    if (this.ctx()) return of(true);

    return this.loadContext().pipe(
      tap((ctx) => this.ctx.set(ctx)),
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      }),
    );
  }

  /* ===================== LOGOUT ===================== */

  logout(): void {
    localStorage.removeItem(LS.accessToken);
    localStorage.removeItem(LS.refreshToken);
    localStorage.removeItem(LS.expiresAt);
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.expiresAt.set(0);
    this.ctx.set(null);
    this.router.navigate(["/login"]);
  }

  /* ===================== HELPERS ===================== */

  private saveTokens(res: LoginResponse) {
    localStorage.setItem(LS.accessToken, res.accessToken);
    if (res.refreshToken) {
      localStorage.setItem(LS.refreshToken, res.refreshToken);
    }
    localStorage.setItem(LS.expiresAt, String(res.expiresAt));

    this.accessToken.set(res.accessToken);
    this.refreshToken.set(res.refreshToken ?? null);
    this.expiresAt.set(res.expiresAt);
  }

  isTokenExpired(): boolean {
    const exp = this.expiresAt();
    return !exp || Date.now() > exp;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken() && !this.isTokenExpired();
  }

  /* ===================== COMPUTED PARA UI ===================== */

  readonly nombres = computed(() => this.ctx()?.nombres ?? null);
  readonly nombresede = computed(() => this.ctx()?.nombresede ?? null);
  readonly ruc = computed(() => this.ctx()?.ruc ?? null);
  readonly razonSocial = computed(() => this.ctx()?.razonSocial ?? null);
  readonly nombreComercial = computed(() => this.ctx()?.nombreComercial ?? null);
  readonly logo = computed(() => this.ctx()?.logo ?? null);
  readonly img = computed(() => this.ctx()?.img ?? null);
  readonly address = computed(() => this.ctx()?.address ?? null);
}
