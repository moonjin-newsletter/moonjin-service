import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface SUBSCRIBE_MYSELF_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.SUBSCRIBE_MYSELF_ERROR;
    httpStatus: 405;
    data: {
        message:"자기 자신을 구독할 수 없습니다."
    }
}

export interface SUBSCRIBE_ALREADY_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.SUBSCRIBE_ALREADY_ERROR;
    httpStatus: 405;
    data: {
        message:"이미 구독한 작가입니다."
    }
}

export interface SUBSCRIBER_NOT_FOUND extends ERROR {
    result : false;
    code: ErrorCodeEnum.SUBSCRIBER_NOT_FOUND;
    httpStatus: 404;
    data: {
        message:"해당하는 구독자가 없습니다."
    }
}

export interface SUBSCRIBER_ALREADY_EXIST extends ERROR {
    result : false;
    code: ErrorCodeEnum.SUBSCRIBER_ALREADY_EXIST;
    httpStatus: 405;
    data: {
        message:"이미 구독자입니다."
    }
}