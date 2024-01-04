import { ERROR } from "./index"

export interface MAIL_ALREADY_EXIST extends ERROR {
    result : false;
    code: 4001
    data: "해당 메일은 이미 존재합니다."
}
export interface NICKNAME_ALREADY_EXIST extends ERROR {
    result : false;
    code: 4002
    data: "해당 닉네임은 이미 존재합니다."
}

export interface SIGNUP_ERROR extends ERROR {
    result : false;
    code : 4003;
    data : "회원가입을 진행할 수 없습니다."
}

export interface MOONJIN_EMAIL_ALREADY_EXIST extends ERROR {
    result : false;
    code : 4004;
    data : "해당 문진 메일은 이미 존재합니다."
}

export interface WRITER_SIGNUP_ERROR extends ERROR {
    result : false;
    code : 4005;
    data : "작가 가입을 진행할 수 없습니다."
}