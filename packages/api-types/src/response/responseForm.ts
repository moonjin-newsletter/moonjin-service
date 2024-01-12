export interface ResponseForm<T> {
    result: true;
    code: 201;
    data: T;
}

export interface ResponseMessage {
    message: string
}
