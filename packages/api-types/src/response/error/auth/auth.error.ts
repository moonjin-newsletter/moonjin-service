import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface PASSWORD_CHANGE_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.PASSWORD_CHANGE_ERROR;
    httpStatus: 406;
    data: {
        message:"비밀번호를 변경할 수 없습니다."
    }
}

export interface USER_NOT_WRITER extends ERROR {
    result : false;
    code: ErrorCodeEnum.USER_NOT_WRITER;
    httpStatus: 403;
    data: {
        message:"해당 유저는 작가가 아닙니다."
    }
}