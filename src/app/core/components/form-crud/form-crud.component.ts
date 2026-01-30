import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-form-crud',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, NgClass],
    templateUrl: './form-crud.component.html',
    styleUrl: './form-crud.component.scss',
})
export class FormCrudComponent {
    titulo = input.required<string>();
    tituloFiltros = input<string>('Filtros de Búsqueda');
    mostrarFiltros = signal<boolean>(true);
    mensajeAdvertencia = input<string>();
}
