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