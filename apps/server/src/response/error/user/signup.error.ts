import { ErrorCodeEnum } from "../enum/errorCode.enum";
import {ERROR} from "../index";

export interface EMAIL_ALREADY_EXIST extends ERROR {
    result : false;
    code: ErrorCodeEnum.MAIL_ALREADY_EXIST;
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
