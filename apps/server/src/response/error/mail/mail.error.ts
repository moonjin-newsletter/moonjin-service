import {ERROR} from "../index";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface EMAIL_NOT_EXIST extends ERROR {
    result : false;
    code : ErrorCodeEnum.EMAIL_NOT_EXIST;
    httpStatus: 404;
    data : "해당 메일이 존재하지 않습니다.";
}
