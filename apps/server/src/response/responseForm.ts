export interface ResponseForm<T> {
    result: true;
    code: 200;
    data: T;
}

export function createResponseForm<T>(data: T): ResponseForm<T> {
    return {
        result: true,
        code: 200,
        data,
    } as const;
}