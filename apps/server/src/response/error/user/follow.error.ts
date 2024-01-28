import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface FOLLOW_MYSELF_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.FOLLOW_MYSELF_ERROR;
    httpStatus: 405;
    data: {
        message:"자기 자신을 팔로우할 수 없습니다."
    }
}

export interface FOLLOW_ALREADY_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.FOLLOW_ALREADY_ERROR;
    httpStatus: 405;
    data: {
        message:"이미 팔로우한 작가입니다."
    }
}

export interface FOLLOWER_NOT_FOUND extends ERROR {
    result : false;
    code: ErrorCodeEnum.FOLLOWER_NOT_FOUND;
    httpStatus: 404;
    data: {
        message:"팔로워가 없습니다."
    }
}