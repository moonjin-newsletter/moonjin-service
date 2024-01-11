import {ERROR} from "../index";
import {ErrorCodeEnum} from "../enum/errorCode.enum";
import {HttpStatus} from "@nestjs/common";

export interface INVALID_TOKEN extends ERROR {
    result : false;
    code : ErrorCodeEnum.INVALID_TOKEN;
    httpStatus: HttpStatus.UNAUTHORIZED;
    data : {
        message:"유효하지 않은 토큰입니다."
    };
}

export interface TOKEN_NOT_FOUND extends ERROR {
    result : false;
    code : ErrorCodeEnum.TOKEN_NOT_FOUND;
    httpStatus: HttpStatus.UNAUTHORIZED;
    data : {
        message:"토큰을 찾을 수 없습니다."
    }
}