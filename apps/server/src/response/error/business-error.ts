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