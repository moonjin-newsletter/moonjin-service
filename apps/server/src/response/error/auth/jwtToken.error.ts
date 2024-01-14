import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface INVALID_TOKEN extends ERROR {
    result : false;
    code : ErrorCodeEnum.INVALID_TOKEN;
    httpStatus: 401;
    data : {
        message:"유효하지 않은 토큰입니다."
    };
}

export interface TOKEN_NOT_FOUND extends ERROR {
    result : false;
    code : ErrorCodeEnum.TOKEN_NOT_FOUND;
    httpStatus: 401;
    data : {
        message:"토큰을 찾을 수 없습니다."
    }
}