import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface STAMP_ALREADY_EXIST extends ERROR {
    result : false;
    code: ErrorCodeEnum.STAMP_ALREADY_EXIST;
    httpStatus: 405;
    data: {
        message:"이미 해당 글에 스탬프가 존재합니다."
    }
}