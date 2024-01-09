import {Exception} from "./index";
import {EMAIL_NOT_EXIST, EMAIL_NOT_VERIFIED} from "./mail/mail.error";
import typia from "typia";
import {
    EMAIL_ALREADY_EXIST,
    MOONJIN_EMAIL_ALREADY_EXIST,
    NICKNAME_ALREADY_EXIST,
    SIGNUP_ERROR, WRITER_SIGNUP_ERROR
} from "./user/signup.error";
import {INVALID_TOKEN, TOKEN_NOT_FOUND} from "./auth/jwtToken.error";
import {
    INVALID_PASSWORD,
    INVALID_SOCIAL,
    LOGIN_ERROR, SOCIAL_LOGIN_ERROR, SOCIAL_PROFILE_NOT_FOUND, SOCIAL_USER_ERROR,
    USER_NOT_FOUND,
    USER_NOT_FOUND_IN_SOCIAL
} from "./user/login.error";

export const ExceptionList= {
    EMAIL_ALREADY_EXIST: new Exception(typia.random<EMAIL_ALREADY_EXIST>()),
    NICKNAME_ALREADY_EXIST : new Exception(typia.random<NICKNAME_ALREADY_EXIST>()),
    MOONJIN_EMAIL_ALREADY_EXIST : new Exception(typia.random<MOONJIN_EMAIL_ALREADY_EXIST>()),
    SIGNUP_ERROR : new Exception(typia.random<SIGNUP_ERROR>()),
    WRITER_SIGNUP_ERROR : new Exception(typia.random<WRITER_SIGNUP_ERROR>()),
    EMAIL_NOT_EXIST : new Exception(typia.random<EMAIL_NOT_EXIST>()),
    TOKEN_NOT_FOUND : new Exception(typia.random<TOKEN_NOT_FOUND>()),
    INVALID_TOKEN : new Exception(typia.random<INVALID_TOKEN>()),
    USER_NOT_FOUND: new Exception(typia.random<USER_NOT_FOUND>()),
    INVALID_PASSWORD: new Exception(typia.random<INVALID_PASSWORD>()),
    LOGIN_ERROR : new Exception(typia.random<LOGIN_ERROR>()),
    EMAIL_NOT_VERIFIED : new Exception(typia.random<EMAIL_NOT_VERIFIED>()),
    INVALID_SOCIAL: new Exception(typia.random<INVALID_SOCIAL>()),
    USER_NOT_FOUND_IN_SOCIAL : new Exception(typia.random<USER_NOT_FOUND_IN_SOCIAL>()),
    SOCIAL_PROFILE_NOT_FOUND : new Exception(typia.random<SOCIAL_PROFILE_NOT_FOUND>()),
    SOCIAL_LOGIN_ERROR : new Exception(typia.random<SOCIAL_LOGIN_ERROR>()),
    SOCIAL_USER_ERROR : new Exception(typia.random<SOCIAL_USER_ERROR>())
}