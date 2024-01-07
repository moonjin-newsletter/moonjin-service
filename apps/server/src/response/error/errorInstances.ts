import {Exception} from "./index";
import {EMAIL_NOT_EXIST} from "./mail/mail.error";
import typia from "typia";
import {
    EMAIL_ALREADY_EXIST,
    MOONJIN_EMAIL_ALREADY_EXIST,
    NICKNAME_ALREADY_EXIST,
    SIGNUP_ERROR, WRITER_SIGNUP_ERROR
} from "./user/signup.error";
import {INVALID_TOKEN, TOKEN_NOT_FOUND} from "./auth/jwtToken.error";

export const ExceptionList = {
    EMAIL_ALREADY_EXIST: new Exception(typia.random<EMAIL_ALREADY_EXIST>()),
    NICKNAME_ALREADY_EXIST : new Exception(typia.random<NICKNAME_ALREADY_EXIST>()),
    MOONJIN_EMAIL_ALREADY_EXIST : new Exception(typia.random<MOONJIN_EMAIL_ALREADY_EXIST>()),
    SIGNUP_ERROR : new Exception(typia.random<SIGNUP_ERROR>()),
    WRITER_SIGNUP_ERROR : new Exception(typia.random<WRITER_SIGNUP_ERROR>()),
    EMAIL_NOT_EXIST : new Exception(typia.random<EMAIL_NOT_EXIST>()),
    TOKEN_NOT_FOUND : new Exception(typia.random<TOKEN_NOT_FOUND>()),
    INVALID_TOKEN : new Exception(typia.random<INVALID_TOKEN>())
}

