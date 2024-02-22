import {Exception} from "./error";
import {EMAIL_NOT_EXIST, EMAIL_NOT_VERIFIED} from "./mail";
import typia from "typia";
import {
    EMAIL_ALREADY_EXIST,
    MOONJIN_EMAIL_ALREADY_EXIST,
    NICKNAME_ALREADY_EXIST, PASSWORD_CHANGE_ERROR,
    SIGNUP_ERROR, SOCIAL_SIGNUP_ERROR, SOCIAL_SIGNUP_TOKEN_NOT_FOUND, WRITER_SIGNUP_ERROR,
    INVALID_TOKEN, TOKEN_NOT_FOUND,
    INVALID_PASSWORD,
    INVALID_SOCIAL,
    LOGIN_ERROR, SOCIAL_LOGIN_ERROR, SOCIAL_PROFILE_NOT_FOUND, SOCIAL_USER_ERROR,
    USER_NOT_FOUND,
    USER_NOT_FOUND_IN_SOCIAL, SIGNUP_ROLE_ERROR, USER_NOT_WRITER
} from "./auth";
import {CREATE_POST_ERROR, NOT_ACCESSED_FOR_POST, POST_NOT_FOUND, STAMP_ALREADY_EXIST} from "./post";
import {FOLLOW_ALREADY_ERROR, FOLLOW_MYSELF_ERROR, FOLLOWER_NOT_FOUND} from "./user";
import {CREATE_SERIES_ERROR, SERIES_NOT_FOUND} from "./series";
import {EMPTY_LIST_INPUT} from "./dev";
import {SEND_LETTER_ERROR} from "./letter";

export const ExceptionList= {
    EMAIL_ALREADY_EXIST: new Exception(typia.random<EMAIL_ALREADY_EXIST>()),
    NICKNAME_ALREADY_EXIST : new Exception(typia.random<NICKNAME_ALREADY_EXIST>()),
    MOONJIN_EMAIL_ALREADY_EXIST : new Exception(typia.random<MOONJIN_EMAIL_ALREADY_EXIST>()),
    SIGNUP_ERROR : new Exception(typia.random<SIGNUP_ERROR>()),
    WRITER_SIGNUP_ERROR : new Exception(typia.random<WRITER_SIGNUP_ERROR>()),
    SIGNUP_ROLE_ERROR : new Exception(typia.random<SIGNUP_ROLE_ERROR>()),
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
    SOCIAL_USER_ERROR : new Exception(typia.random<SOCIAL_USER_ERROR>()),
    SOCIAL_SIGNUP_TOKEN_NOT_FOUND : new Exception(typia.random<SOCIAL_SIGNUP_TOKEN_NOT_FOUND>()),
    SOCIAL_SIGNUP_ERROR : new Exception(typia.random<SOCIAL_SIGNUP_ERROR>()),
    PASSWORD_CHANGE_ERROR : new Exception(typia.random<PASSWORD_CHANGE_ERROR>()),
    USER_NOT_WRITER : new Exception(typia.random<USER_NOT_WRITER>()),

    //Post
    CREATE_POST_ERROR : new Exception(typia.random<CREATE_POST_ERROR>()),
    POST_NOT_FOUND : new Exception(typia.random<POST_NOT_FOUND>()),
    NOT_ACCESSED_FOR_POST : new Exception(typia.random<NOT_ACCESSED_FOR_POST>()),
    /// stamp
    STAMP_ALREADY_EXIST : new Exception(typia.random<STAMP_ALREADY_EXIST>()),

    // Series
    CREATE_SERIES_ERROR : new Exception(typia.random<CREATE_SERIES_ERROR>()),
    SERIES_NOT_FOUND : new Exception(typia.random<SERIES_NOT_FOUND>()),

    // User
    FOLLOW_MYSELF_ERROR : new Exception(typia.random<FOLLOW_MYSELF_ERROR>()),
    FOLLOW_ALREADY_ERROR : new Exception(typia.random<FOLLOW_ALREADY_ERROR>()),
    FOLLOWER_NOT_FOUND : new Exception(typia.random<FOLLOWER_NOT_FOUND>()),

    // Letter
    SEND_LETTER_ERROR : new Exception(typia.random<SEND_LETTER_ERROR>()),

    //dev
    EMPTY_LIST_INPUT : new Exception(typia.random<EMPTY_LIST_INPUT>()),
}