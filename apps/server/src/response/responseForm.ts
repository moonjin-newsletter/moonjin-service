export interface ResponseForm<T> {
    result: true;
    code: 201;
    data: T;
}

export function createResponseForm<T>(data: T): ResponseForm<T> {
    return {
        result: true,
        code: 201,
        data,
    } as const;
}
