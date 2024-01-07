import {ERROR} from "../index";
import {ErrorCodeEnum} from "../enum/errorCode.enum";
import {HttpStatus} from "@nestjs/common";

export interface EMAIL_NOT_EXIST extends ERROR {
    result : false;
    code : ErrorCodeEnum.EMAIL_NOT_EXIST;
    httpStatus: HttpStatus.NOT_FOUND;
    data : {
        message : "해당 메일이 존재하지 않습니다."
    };
}

export interface EMAIL_NOT_VERIFIED extends ERROR {
    result : false;
    code : ErrorCodeEnum.EMAIL_NOT_VERIFIED;
    httpStatus: HttpStatus.UNAUTHORIZED;
    data : {
        message : "메일이 인증되지 않았습니다. 메일 인증을 해주세요"
    };
}


