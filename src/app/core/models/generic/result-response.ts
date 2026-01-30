export interface ResultResponse<T> {
    status: {
        code: number
        status: string
        message: string
    }
    data: T
}
