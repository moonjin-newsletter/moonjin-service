import {PaginationMetaDataDto} from "../api-types/common/pagination/dto";

export interface ResponseForm<T> {
    result: true;
    code: 201;
    data: T;
    pagination : PaginationMetaDataDto | null;
}

export interface ResponseMessage {
    message: string
}
