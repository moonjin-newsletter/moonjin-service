import {PaginationMetaDataDto} from "../common/pagination/dto";

export interface ResponseForm<T> {
    result: true;
    code: 201;
    data: T;
    pagination : PaginationMetaDataDto | null;
}

export function createResponseForm<T>(data: T, pagination?: PaginationMetaDataDto): ResponseForm<T> {
    return {
        result: true,
        code: 201,
        data,
        pagination : pagination ?? null
    } as const;
}

export interface ResponseMessage {
    message: string
}
