import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface PROFILE_CHANGE_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.PROFILE_CHANGE_ERROR;
    httpStatus: 403;
    data: {
        message:"프로필을 수정할 수 없습니다."
    }
}