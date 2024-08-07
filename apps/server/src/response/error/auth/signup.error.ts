import { ErrorCodeEnum } from "../enum/errorCode.enum";
import {ERROR} from "../error";

export interface EMAIL_ALREADY_EXIST extends ERROR {
    result : false;
    code: ErrorCodeEnum.EMAIL_ALREADY_EXIST;
    httpStatus: 403;
    data: {
        message:"이미 존재하는 메일입니다."
    }
}
export interface NICKNAME_ALREADY_EXIST extends ERROR {
    result : false;
    code: ErrorCodeEnum.NICKNAME_ALREADY_EXIST;
    httpStatus: 403;
    data: {
        message:"이미 존재하는 닉네임 입니다."
    }
}

export interface MOONJIN_EMAIL_ALREADY_EXIST extends ERROR {
    result : false;
    code: ErrorCodeEnum.MOONJIN_EMAIL_ALREADY_EXIST;
    httpStatus: 403;
    data: {
        message:"이미 존재하는 문진 이메일입니다."
    }
}

export interface SIGNUP_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.SIGNUP_ERROR;
    httpStatus: 406,
    data : {
        message:"회원가입을 진행할 수 없습니다."
    }
}

export interface WRITER_SIGNUP_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.WRITER_SIGNUP_ERROR;
    httpStatus: 406,
    data : {
        message:"작가 가입을 진행할 수 없습니다."
    }
}

export interface SIGNUP_ROLE_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.SIGNUP_ROLE_ERROR;
    httpStatus: 403,
    data : {
        message:"role과 moonjinEmail의 형식이 올바르지 않습니다."
    }
}

export interface SOCIAL_SIGNUP_TOKEN_NOT_FOUND extends ERROR {
    result : false;
    code : ErrorCodeEnum.SOCIAL_SIGNUP_TOKEN_NOT_FOUND;
    httpStatus: 401,
    data : {
        message:"소셜 회원가입을 진행할 권한이 없습니다."
    }
}

export interface SOCIAL_SIGNUP_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.SOCIAL_SIGNUP_ERROR;
    httpStatus: 406,
    data : {
        message:"소셜 회원가입을 진행할 수 없습니다."
    }
}