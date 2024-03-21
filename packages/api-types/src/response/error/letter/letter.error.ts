import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface SEND_LETTER_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.SEND_LETTER_ERROR;
    httpStatus: 403;
    data : {
        message : "해당 편지를 보낼 수 없습니다."
    };
}

export interface FORBIDDEN_FOR_LETTER extends ERROR {
    result : false;
    code : ErrorCodeEnum.FORBIDDEN_FOR_LETTER;
    httpStatus: 403;
    data : {
        message : "해당 편지에 접근 권한이 없습니다."
    };
}

export interface LETTER_NOT_FOUND extends ERROR {
    result : false;
    code : ErrorCodeEnum.LETTER_NOT_FOUND;
    httpStatus: 404;
    data : {
        message : "해당 편지가 존재하지 않습니다."
    };
}

export interface LETTER_ALREADY_READ extends ERROR {
    result : false;
    code : ErrorCodeEnum.LETTER_ALREADY_READ;
    httpStatus: 403;
    data : {
        message : "해당 편지를 이미 읽었습니다."
    };
}

