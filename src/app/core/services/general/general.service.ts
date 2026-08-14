import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IInformacionNavegadorCliente } from '@gob/core/models/generic/general.model';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GeneralService {
    private ipSubject = new BehaviorSubject<string>('');
    ip$ = this.ipSubject.asObservable();
    ipCliente = '';
    informacionNavegadorCliente: IInformacionNavegadorCliente | undefined;
    httpClient = inject(HttpClient);

    getIp() {
        return this.httpClient.get<IInformacionNavegadorCliente>(
            environment.apiIp
        );
    }

    cargarDatos() {
        this.getIp().subscribe((data) => {
            this.ipCliente = data.ip;
            this.informacionNavegadorCliente = data;
            this.ipSubject.next(data.ip);
        });
    }
}