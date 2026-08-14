import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubidaImagenService {
  private endpoint = environment.apiImagenes;

  constructor(private http: HttpClient) {}

  subirImagen(file: File) {
    const formData = new FormData();
    formData.append('imagen', file);

    return this.http.post(this.endpoint, formData);
  }
}