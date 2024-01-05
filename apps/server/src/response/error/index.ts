import {HttpException} from "@nestjs/common";

export interface ERROR {
    result: false;
    code: string; // 4000 ~ 4999
    httpStatus: number;
    data: string; // error Message
}

export class Exception extends HttpException {
    constructor(error : ERROR) {
        super(error,error.httpStatus);
    }
}
