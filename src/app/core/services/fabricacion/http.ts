import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export function useApi() {
  const http = inject(HttpClient);
  const base = environment.apiUrlBase;
  return { http, base };
}