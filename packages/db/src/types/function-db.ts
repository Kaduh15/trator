export type ReturnFunction<T> = [T, null] | [null, Error]

export type AsyncReturnFunction<T> = Promise<ReturnFunction<T>>
