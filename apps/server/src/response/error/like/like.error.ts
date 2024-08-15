import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface LIKE_NOT_FOUND extends ERROR{
    result : false;
    code : ErrorCodeEnum.LIKE_NOT_FOUND;
    httpStatus: 404;
    data : {
        message : "좋아요가 존재하지 않습니다."
    };
}

export interface LIKE_ALREADY_EXIST extends ERROR{
    result : false;
    code : ErrorCodeEnum.LIKE_ALREADY_EXIST;
    httpStatus: 406;
    data : {
        message : "좋아요가 이미 존재합니다."
    };
}
