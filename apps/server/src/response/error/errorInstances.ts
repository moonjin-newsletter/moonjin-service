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
    USER_NOT_FOUND_IN_SOCIAL, SIGNUP_ROLE_ERROR, USER_NOT_WRITER, OAUTH_NOT_FOUND
} from "./auth";
import {
    CREATE_POST_ERROR,
    FORBIDDEN_FOR_POST, NEWSLETTER_ALREADY_EXIST, NEWSLETTER_CATEGORY_NOT_FOUND, NEWSLETTER_NOT_FOUND,
    POST_CONTENT_NOT_FOUND,
    POST_NOT_FOUND, SEND_NEWSLETTER_ERROR,
    STAMP_ALREADY_EXIST
} from "./post";
import {SUBSCRIBE_ALREADY_ERROR, SUBSCRIBE_MYSELF_ERROR, SUBSCRIBER_ALREADY_EXIST, SUBSCRIBER_NOT_FOUND} from "./subscribe";
import {CREATE_SERIES_ERROR, FORBIDDEN_FOR_SERIES, SERIES_NOT_EMPTY, SERIES_NOT_FOUND} from "./series";
import {EMPTY_LIST_INPUT, EMPTY_VALUE_INPUT} from "./dev";
import {LETTER_ALREADY_READ, LETTER_NOT_FOUND, FORBIDDEN_FOR_LETTER, SEND_LETTER_ERROR} from "./letter";
import {FILE_EXTENTION_ERROR, FILE_UPLOAD_ERROR} from "./file";
import {PROFILE_CHANGE_ERROR} from "./user";

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

    // oauth
    OAUTH_NOT_FOUND : new Exception(typia.random<OAUTH_NOT_FOUND>()),

    //Post
    CREATE_POST_ERROR : new Exception(typia.random<CREATE_POST_ERROR>()),
    POST_NOT_FOUND : new Exception(typia.random<POST_NOT_FOUND>()),
    FORBIDDEN_FOR_POST : new Exception(typia.random<FORBIDDEN_FOR_POST>()),
    POST_CONTENT_NOT_FOUND : new Exception(typia.random<POST_CONTENT_NOT_FOUND>()),
    /// stamp
    STAMP_ALREADY_EXIST : new Exception(typia.random<STAMP_ALREADY_EXIST>()),
    /// newsletter
    SEND_NEWSLETTER_ERROR : new Exception(typia.random<SEND_NEWSLETTER_ERROR>()),
    NEWSLETTER_CATEGORY_NOT_FOUND : new Exception(typia.random<NEWSLETTER_CATEGORY_NOT_FOUND>()),
    NEWSLETTER_NOT_FOUND : new Exception(typia.random<NEWSLETTER_NOT_FOUND>()),
    NEWSLETTER_ALREADY_EXIST : new Exception(typia.random<NEWSLETTER_ALREADY_EXIST>()),

    // Series
    CREATE_SERIES_ERROR : new Exception(typia.random<CREATE_SERIES_ERROR>()),
    SERIES_NOT_FOUND : new Exception(typia.random<SERIES_NOT_FOUND>()),
    FORBIDDEN_FOR_SERIES : new Exception(typia.random<FORBIDDEN_FOR_SERIES>()),
    SERIES_NOT_EMPTY : new Exception(typia.random<SERIES_NOT_EMPTY>()),

    // User
    SUBSCRIBE_MYSELF_ERROR : new Exception(typia.random<SUBSCRIBE_MYSELF_ERROR>()),
    SUBSCRIBE_ALREADY_ERROR : new Exception(typia.random<SUBSCRIBE_ALREADY_ERROR>()),
    SUBSCRIBER_NOT_FOUND : new Exception(typia.random<SUBSCRIBER_NOT_FOUND>()),
    SUBSCRIBER_ALREADY_EXIST : new Exception(typia.random<SUBSCRIBER_ALREADY_EXIST>()),
    PROFILE_CHANGE_ERROR : new Exception(typia.random<PROFILE_CHANGE_ERROR>()),

    // Letter
    SEND_LETTER_ERROR : new Exception(typia.random<SEND_LETTER_ERROR>()),
    FORBIDDEN_FOR_LETTER : new Exception(typia.random<FORBIDDEN_FOR_LETTER>()),
    LETTER_NOT_FOUND : new Exception(typia.random<LETTER_NOT_FOUND>()),
    LETTER_ALREADY_READ : new Exception(typia.random<LETTER_ALREADY_READ>()),
    //file
    FILE_EXTENTION_ERROR: new Exception(typia.random<FILE_EXTENTION_ERROR>()),
    FILE_UPLOAD_ERROR: new Exception(typia.random<FILE_UPLOAD_ERROR>()),
    //dev
    EMPTY_LIST_INPUT : new Exception(typia.random<EMPTY_LIST_INPUT>()),
    EMPTY_VALUE_INPUT : new Exception(typia.random<EMPTY_VALUE_INPUT>()),
}