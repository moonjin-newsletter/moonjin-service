import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface OAUTH_NOT_FOUND extends ERROR{
    result: false;
    code : ErrorCodeEnum.OAUTH_NOT_FOUND;
    httpStatus: 404;
    data : {
        message: "해당 유저의 Oauth를 찾을 수 없습니다."
    }
}