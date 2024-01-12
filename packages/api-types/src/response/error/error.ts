import {HttpException} from "@nestjs/common";

export interface ERROR {
    result: false;
    code: string; // 4000 ~ 4999
    httpStatus: number;
    data: ErrorData; // error Message
}

export interface ErrorData{
    message:string
}

export class Exception extends HttpException {
    constructor(error : ERROR) {
        super(error,error.httpStatus);
    }
}
