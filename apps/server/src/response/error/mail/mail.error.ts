import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface EMAIL_NOT_EXIST extends ERROR {
    result : false;
    code : ErrorCodeEnum.EMAIL_NOT_EXIST;
    httpStatus: 404;
    data : {
        message : "해당 메일이 존재하지 않습니다."
    };
}

export interface EMAIL_NOT_VERIFIED extends ERROR {
    result : false;
    code : ErrorCodeEnum.EMAIL_NOT_VERIFIED;
    httpStatus: 401;
    data : {
        message : "메일이 인증되지 않았습니다. 메일 인증을 해주세요"
    };
}


