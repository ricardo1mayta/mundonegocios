import { obtenerAniosDesde } from '../../../shared/utils';

export interface ICombobox {
  value: number;
  text: string;
  icon?: string;
}

export function getCmbOrdenamiento(): ICombobox[] {
  return [
    { value: 1, text: 'Más recientes primero' },
    { value: 0, text: 'Más antiguos primero' },
  ] as ICombobox[];
}

export function getCmbAnios(): ICombobox[] {
  const cmbAnio: ICombobox[] = [];
  const anios = obtenerAniosDesde(2023);
  anios.forEach((anio) => {
    cmbAnio.push({ value: anio, text: anio.toString() });
  });
  return cmbAnio;
}
