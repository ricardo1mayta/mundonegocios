export interface IPaginationRequest<T> {
    datos: T
    pagina: number
    tamanio: number
    campoOrdenamiento?: string
    orden?: number
}
