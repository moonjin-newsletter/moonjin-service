import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface USER_NOT_FOUND extends ERROR {
    result : false;
    code: ErrorCodeEnum.USER_NOT_FOUND;
    httpStatus: 404;
    data: {
        message:"해당 유저를 찾을 수 없습니다."
    }
}

export interface INVALID_PASSWORD extends ERROR {
    result : false;
    code: ErrorCodeEnum.INVALID_PASSWORD;
    httpStatus: 401;
    data: {
        message:"패스워드가 다릅니다."
    }
}

export interface LOGIN_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.LOGIN_ERROR;
    httpStatus: 406;
    data: {
        message:"로그인할 수 없습니다."
    }
}

export interface INVALID_SOCIAL extends ERROR {
    result: false;
    code : ErrorCodeEnum.INVALID_SOCIAL;
    httpStatus: 401;
    data : {
        message: "잘못된 social 입니다."
    }
}

export interface USER_NOT_FOUND_IN_SOCIAL extends ERROR {
    result: false;
    code : ErrorCodeEnum.USER_NOT_FOUND_IN_SOCIAL;
    httpStatus: 404;
    data : {
        message: "해당 oauthCode로 접근할 수 있는 유저가 없습니다."
    }
}

export interface SOCIAL_PROFILE_NOT_FOUND extends ERROR {
    result: false;
    code : ErrorCodeEnum.SOCIAL_PROFILE_NOT_FOUND;
    httpStatus: 404;
    data : {
        message: "해당 social에서 유저 정보를 불러올 수 없습니다."
    }
}

export interface SOCIAL_LOGIN_ERROR extends ERROR{
    result: false;
    code : ErrorCodeEnum.SOCIAL_LOGIN_ERROR;
    httpStatus: 406;
    data : {
        message: "소셜 로그인을 진행할 수 없습니다."
    }
}

export interface SOCIAL_USER_ERROR extends ERROR {
    result: false;
    code : ErrorCodeEnum.SOCIAL_USER_ERROR;
    httpStatus: 401;
    data : {
        message: "소셜 유저입니다. 소셜 로그인으로 로그인 해주세요."
    }
}